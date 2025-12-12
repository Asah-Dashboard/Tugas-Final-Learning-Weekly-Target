function getDayNameFromDate(dateString) {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // Tambahkan 'T00:00:00' untuk memastikan zona waktu lokal yang benar
  const date = new Date(dateString + 'T00:00:00');
  return days[date.getDay()];
}

// Tambahkan global state untuk chart sehingga dapat diperbarui setelah check-in
window.weeklyProgressChart = null;
window.globalTargetData = [];
window.globalActualData = [];
window.globalDaysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

// Global constants - API_BASE is defined in config.js
// Use window.API_BASE directly to avoid redeclaration errors
var API_BASE = window.API_BASE || "http://localhost:5001/api";
var USER_ID = localStorage.getItem('user_id');
if (!USER_ID) {
  alert('Please login first');
  window.location.href = '/login';
}

// --- GANTI / TAMBAHKAN helper normalisasi & parser yang lebih robust ---
function normalizeDayName(raw) {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().toLowerCase();
  const engMap = {
    mon: 'Senin', monday: 'Senin',
    tue: 'Selasa', tues: 'Selasa', tuesday: 'Selasa',
    wed: 'Rabu', wednesday: 'Rabu',
    thu: 'Kamis', thur: 'Kamis', thursday: 'Kamis',
    fri: 'Jumat', friday: 'Jumat',
    sat: 'Sabtu', saturday: 'Sabtu',
    sun: 'Minggu', sunday: 'Minggu'
  };
  // angka tunggal
  if (/^[0-6]$/.test(s)) {
    const arr = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    return arr[Number(s)];
  }
  if (/^[1-7]$/.test(s)) {
    const arr1 = [null,'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
    return arr1[Number(s)] || null;
  }
  const indo = {
    'minggu':'Minggu','senin':'Senin','selasa':'Selasa','rabu':'Rabu',
    'kamis':'Kamis','jumat':'Jumat','jumat.':'Jumat','sabtu':'Sabtu'
  };
  if (indo[s]) return indo[s];
  if (engMap[s]) return engMap[s];
  // fallback: capitalize first letter
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * parseTargetDays(raw, daysOrder)
 * - daysOrder expected ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"]
 * - accepts:
 *   - array names ["Senin","Rabu"]
 *   - array booleans/0-1 length 7
 *   - array numbers [2] (0..6 JS getDay OR 1..7 with 1=Senin)
 *   - object map {"Senin":1, "Selasa":0}
 *   - string JSON or comma-separated
 */
function parseTargetDays(raw, daysOrder) {
  const out = Array(daysOrder.length).fill(0);
  if (!raw && raw !== 0) return out;

  // string -> try JSON or csv
  if (typeof raw === 'string') {
    const s = raw.trim();
    try {
      const parsed = JSON.parse(s);
      return parseTargetDays(parsed, daysOrder);
    } catch (e) {
      const parts = s.split(/[,;|]/).map(p => p.trim()).filter(Boolean);
      return parseTargetDays(parts, daysOrder);
    }
  }

  // array handling
  if (Array.isArray(raw)) {
    // case: boolean/0-1 flags length 7
    if (raw.length === daysOrder.length && raw.every(v => v === 0 || v === 1 || v === true || v === false)) {
      return raw.map(v => v ? 1 : 0);
    }

    // case: array of numbers (could be 0..6 JS or 1..7 Mon..Sun)
    if (raw.every(v => typeof v === 'number' || (/^\d+$/.test(String(v))))) {
      const nums = raw.map(Number);
      const all01 = nums.every(n => n === 0 || n === 1);
      if (all01 && nums.length === daysOrder.length) {
        return nums.map(n => n ? 1 : 0);
      }
      // detect format
      const all0to6 = nums.every(n => n >= 0 && n <= 6);
      const all1to7 = nums.every(n => n >= 1 && n <= 7);
      nums.forEach(n => {
        let idx = -1;
        if (all0to6) {
          // JS getDay mapping 0=Sun -> daysOrder index 6
          idx = (n + 6) % 7;
        } else if (all1to7) {
          // 1->Senin (index 0)
          idx = n - 1;
        } else {
          return;
        }
        if (idx >= 0 && idx < daysOrder.length) out[idx] = 1;
      });
      return out;
    }

    // case: array of names
    raw.forEach(item => {
      const name = normalizeDayName(item);
      const idx = daysOrder.indexOf(name);
      if (idx !== -1) out[idx] = 1;
    });
    return out;
  }

  // object map: keys may be names or numbers
  if (typeof raw === 'object') {
    Object.keys(raw).forEach(k => {
      const val = raw[k];
      // if key numeric
      if (/^\d+$/.test(String(k))) {
        const n = Number(k);
        let idx = -1;
        if (n >= 0 && n <= 6) idx = (n + 6) % 7;
        else if (n >= 1 && n <= 7) idx = n - 1;
        if (idx >= 0 && idx < daysOrder.length) out[idx] = (val ? 1 : 0);
      } else {
        const name = normalizeDayName(k);
        const idx = daysOrder.indexOf(name);
        if (idx !== -1) out[idx] = (raw[k] ? 1 : 0);
      }
    });
    return out;
  }

  // fallback single value (name or number)
  return parseTargetDays([raw], daysOrder);
}

// Load tasks summary for dashboard
async function loadTasksSummary() {
  try {
    const response = await fetch(`${API_BASE}/tasks/stats?user_id=${USER_ID}`);
    const result = await response.json();

    if (result.success) {
      const stats = result.data;
      document.getElementById('taskTotalDash').textContent = stats.total || 0;
      document.getElementById('taskPendingDash').textContent = stats.pending || 0;
      document.getElementById('taskInProgressDash').textContent = stats.in_progress || 0;
    }

    // Load recent tasks
    const tasksResponse = await fetch(`${API_BASE}/tasks?user_id=${USER_ID}`);
    const tasksResult = await tasksResponse.json();

    if (tasksResult.success && tasksResult.data.length > 0) {
      const tasks = tasksResult.data.slice(0, 3); // Show only 3 recent tasks
      const tasksListDash = document.getElementById('tasksListDash');
      
      if (tasks.length > 0) {
        tasksListDash.innerHTML = tasks.map(task => `
          <div style="padding: 10px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #333; ${task.status === 'completed' ? 'text-decoration: line-through; color: #999;' : ''}">${task.title}</div>
              <div style="font-size: 0.85rem; color: #666;">
                <span class="status-${task.status.replace('_', '-')}" style="padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; background: ${task.status === 'completed' ? '#e8f5e9' : task.status === 'in_progress' ? '#e3f2fd' : '#fce4ec'}; color: ${task.status === 'completed' ? '#2e7d32' : task.status === 'in_progress' ? '#1976d2' : '#c2185b'};">
                  ${task.status === 'completed' ? 'Selesai' : task.status === 'in_progress' ? 'Progress' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        tasksListDash.innerHTML = '<p style="text-align: center; color: #999; margin: 10px 0;">Tidak ada tugas</p>';
      }
    }
  } catch (error) {
    console.error('Error loading tasks summary:', error);
  }
}

// IIFE untuk mengambil dan memproses data dari API
(async () => {
  const progressTextEl = document.getElementById("progressText");
  
  // Load tasks summary
  loadTasksSummary();
  // helper: render or update chart dari data yang diberikan
  function renderWeeklyChart(daysOfWeek, actualData, targetData, titleText) {
    try {
      const ctxEl = document.getElementById("weeklyProgressChart");
      if (!ctxEl) return;
      const ctx = ctxEl.getContext("2d");
      const dataObj = {
        labels: daysOfWeek,
        datasets: [
          {
            label: "Target Selesai (Actual)",
            data: actualData,
            backgroundColor: "#00ff88",
            borderColor: "#00cc66",
            borderWidth: 3,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: "Total Target",
            data: targetData,
            backgroundColor: "#e0e0e0",
            borderColor: "#999999",
            borderWidth: 3,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: "top" },
          title: { display: !!titleText, text: titleText || '' },
        },
        scales: { y: { beginAtZero: true, max: 1 } }
      };

      if (window.weeklyProgressChart) {
        window.weeklyProgressChart.data = dataObj;
        window.weeklyProgressChart.options = options;
        window.weeklyProgressChart.update();
      } else {
        window.weeklyProgressChart = new Chart(ctx, { type: "bar", data: dataObj, options });
      }
    } catch (e) {
      console.warn('renderWeeklyChart failed', e);
    }
  }

  // Jika ada cache langsung render supaya UX tidak reset saat pindah halaman
  try {
    const cachedTarget = (() => { try { return JSON.parse(localStorage.getItem('local_target') || 'null'); } catch(e){ return null; } })();
    const cachedActual = (() => { try { return JSON.parse(localStorage.getItem('local_actual') || 'null'); } catch(e){ return null; } })();
    const cachedDays = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
    if (Array.isArray(cachedTarget) && Array.isArray(cachedActual) && cachedTarget.length === 7 && cachedActual.length === 7) {
      // set globals so other code sees them
      window.globalTargetData = cachedTarget;
      window.globalActualData = cachedActual;
      window.globalDaysOfWeek = cachedDays;
      renderWeeklyChart(cachedDays, cachedActual, cachedTarget, 'Target vs Aktual (cached)');
      // initial progress text from cache
      if (progressTextEl) {
        const totalCompleted = cachedActual.reduce((a,b)=>a+b,0);
        const totalTarget = cachedTarget.reduce((a,b)=>a+b,0);
        progressTextEl.innerHTML = `<strong>Anda telah menyelesaikan ${totalCompleted} dari ${totalTarget} target belajar minggu ini.</strong>`;
      }
    }
  } catch (e) { /* ignore cache read errors */ }

  try {
    // -----------------------------------------------------------------
    // LANGKAH 1: Mengambil data dari Backend API (Bukan localStorage)
    // -----------------------------------------------------------------
    const res = await fetch(`${API_BASE}/dashboard/weekly?user_id=${USER_ID}`);
    if (!res.ok) {
      throw new Error('Gagal mengambil data dari server');
    }
    
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || 'Gagal memuat data');
    }

    const data = result.data; // Ini data dari API: { target: 2, actual: 0, targetDetails: ..., actualDetails: ... }

      // -----------------------------------------------------------------
      // LANGKAH 2: Memproses Data (PERBAIKAN LOGIKA SYNC)
      // -----------------------------------------------------------------
      const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
      // Ambil raw target days dari API
      const targetRaw = data.targetDetails ? data.targetDetails.days : [];
      // parse menjadi boolean array sesuai daysOfWeek
      const parsedTargetBool = parseTargetDays(targetRaw, daysOfWeek);

      const targetData = [];
      const actualData = [];
      const actualLogs = data.actualDetails || [];
      const actualDayNames = actualLogs.map(log => getDayNameFromDate(log.log_date));

      // --- [FIX] DEFINISIKAN ULANG cachedActual AGAR TIDAK ERROR ---
      const cachedActual = (() => { 
          try { return JSON.parse(localStorage.getItem('local_actual') || 'null'); } 
          catch(e){ return null; } 
      })();
      // -------------------------------------------------------------

      // --- Persiapan Cek Status Lokal ---
      const todayStr = new Date().toLocaleDateString('sv-SE');
      const localCheckInFlag = localStorage.getItem('checked_in_today');
      const isCheckedInLocally = (localCheckInFlag === todayStr);
      const todayDayIndex = (new Date().getDay() + 6) % 7;
      // -----------------------------------------

      daysOfWeek.forEach((day, idx) => {
        // 1. Push Target
        targetData.push(parsedTargetBool[idx] ? 1 : 0);

        // 2. Tentukan Status Actual
        let isDone = 0;

        // A. Cek dari Server (API)
        if (actualDayNames.includes(day)) {
          isDone = 1;
        }

        // B. Cek Cache 'local_actual' (sekarang aman karena sudah didefinisikan)
        if (cachedActual && Array.isArray(cachedActual) && cachedActual[idx] === 1) {
          isDone = 1;
        }

        // C. Cek manual 'checked_in_today' (FIX untuk refresh)
        if (idx === todayDayIndex && isCheckedInLocally) {
          isDone = 1;
        }

        actualData.push(isDone);
      });

        // Update global cache biar sinkron
        window.globalTargetData = targetData;
        window.globalActualData = actualData;
        window.globalDaysOfWeek = daysOfWeek;
        
    // simpan merged hasil ke cache agar tidak "reset" setelah navigation
    try {
      localStorage.setItem('local_target', JSON.stringify(window.globalTargetData));
      localStorage.setItem('local_actual', JSON.stringify(window.globalActualData));
    } catch (e) { /* ignore */ }

    // Jika user baru saja melakukan log di halaman log_progress, tandai ke chart
    try {
      const justLogged = localStorage.getItem('just_logged'); // ISO date string 'YYYY-MM-DD'
      if (justLogged) {
        const todayISO = new Date().toLocaleDateString('sv-SE');
        if (justLogged === todayISO) {
          // hitung index hari ini pada daysOfWeek (0=Senin)
          const todayIdx = (new Date().getDay() + 6) % 7;
          // Update actual data
          if (window.globalActualData && window.globalActualData[todayIdx] !== 1) {
            window.globalActualData[todayIdx] = 1;
            // update cache also
            try {
              const saved = JSON.parse(localStorage.getItem('local_actual') || 'null') || Array(7).fill(0);
              saved[todayIdx] = 1;
              localStorage.setItem('local_actual', JSON.stringify(saved));
              localStorage.setItem('checked_in_today', todayISO);
            } catch(e){}
            
            // Update chart if exists
            if (window.weeklyProgressChart) {
              window.weeklyProgressChart.data.datasets[0].data = window.globalActualData;
              window.weeklyProgressChart.update();
            }
            
            // update progress text
            if (progressTextEl) {
              const totalCompleted = window.globalActualData.reduce((a, b) => a + b, 0);
              const totalTarget = window.globalTargetData.reduce((a, b) => a + b, 0);
              progressTextEl.innerHTML = `<strong>Anda telah menyelesaikan ${totalCompleted} dari ${totalTarget} target belajar minggu ini.</strong>`;
            }
            
            // Refresh check-in button status
            if (typeof checkStudyDay === 'function') {
              setTimeout(() => checkStudyDay(), 500);
            }
          }
        }
        localStorage.removeItem('just_logged');
      }
    } catch (e) {
      console.warn('apply just_logged failed', e);
    }

    // -----------------------------------------------------------------
    // LANGKAH 3: Render Teks Progres & Chart (Kode styling Anda)
    // -----------------------------------------------------------------

    // Update progress text awal
    function updateProgressText() {
      const totalCompleted = window.globalActualData.reduce((a, b) => a + b, 0);
      const totalTarget = window.globalTargetData.reduce((a, b) => a + b, 0);
      if (progressTextEl) progressTextEl.innerHTML = `<strong>Anda telah menyelesaikan ${totalCompleted} dari ${totalTarget} target belajar minggu ini.</strong>`;
    }
    updateProgressText();

    // render chart (gunakan helper sehingga bisa diupdate lagi)
    renderWeeklyChart(daysOfWeek, window.globalActualData, window.globalTargetData, `Target vs Aktual (${data.range.start} s/d ${data.range.end})`);

  } catch (err) {
    // Tangani error jika API gagal
    console.error(err);
    if (progressTextEl) progressTextEl.textContent = "Gagal memuat data dari API. Periksa konsol.";
  }
})();

// Check-in functionality
// Event listener untuk check-in button
document.addEventListener('DOMContentLoaded', () => {
	// Cari elemen sekali setelah DOM siap
	const checkInBtnEl = document.getElementById('checkInBtn');
	const statusEl = document.getElementById('checkInStatus');

	if (checkInBtnEl) {
		// Set initial state
		checkInBtnEl.disabled = true;
		checkInBtnEl.textContent = 'Memuat...';
		
		// Check study day status (delay sedikit untuk memastikan DOM ready)
		setTimeout(() => {
			checkStudyDay();
		}, 100);
		
		// Add click handler
		checkInBtnEl.addEventListener('click', async () => {
			if (checkInBtnEl.disabled) {
				return;
			}
			
			// Redirect ke halaman log progress
			window.location.href = '/log_progress';
		});
	}
});

// Function to check if today is a study day and enable/disable check-in button
async function checkStudyDay() {
  const checkInBtn = document.getElementById('checkInBtn');
  const statusEl = document.getElementById('checkInStatus');
  
  if (!checkInBtn) {
    console.warn('checkInBtn not found, aborting checkStudyDay.');
    return;
  }

  // Set loading state
  checkInBtn.disabled = true;
  checkInBtn.style.background = '#cccccc';
  checkInBtn.style.cursor = 'not-allowed';
  checkInBtn.style.opacity = '0.7';
  checkInBtn.textContent = 'Memuat...';
  if (statusEl) statusEl.textContent = '';

  try {
    // Ambil target user (jadwal hari)
    const res = await fetch(`${API_BASE}/targets?user_id=${USER_ID}`);
    if (!res.ok) {
      throw new Error('Failed to fetch targets');
    }
    const payload = await res.json();

    if (payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
      const target = payload.data[0];
      const rawDays = target.days !== undefined ? target.days : [];

      const daysOrder = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
      const targetBool = parseTargetDays(rawDays, daysOrder);

      const today = new Date();
      const todayIdx = (today.getDay() + 6) % 7; // map JS 0..6 -> Senin..Minggu index
      const isStudyDay = !!targetBool[todayIdx];

      // Cek apakah user sudah check-in hari ini
      const todayISO = new Date().toLocaleDateString('sv-SE');
      let alreadyCheckedIn = false;
      
      // Cek dari localStorage dulu (lebih cepat)
      const localFlag = localStorage.getItem('checked_in_today') || localStorage.getItem('just_logged');
      if (localFlag === todayISO) {
        alreadyCheckedIn = true;
      }
      
      // Cek dari backend jika belum ada di localStorage
      if (!alreadyCheckedIn) {
        try {
          const weeklyRes = await fetch(`${API_BASE}/dashboard/weekly?user_id=${USER_ID}`);
          if (weeklyRes.ok) {
            const weeklyJson = await weeklyRes.ok ? await weeklyRes.json() : null;
            if (weeklyJson && weeklyJson.success && Array.isArray(weeklyJson.data.actualDetails)) {
              alreadyCheckedIn = weeklyJson.data.actualDetails.some(log => {
                const logDate = log.log_date || '';
                const logDateShort = logDate.substring(0, 10);
                return logDateShort === todayISO;
              });
            }
          }
        } catch (e) {
          console.warn('Error checking backend for check-in status:', e);
        }
      }

      // Update button based on status
      if (isStudyDay) {
        if (alreadyCheckedIn) {
          checkInBtn.disabled = true;
          checkInBtn.style.background = '#cccccc';
          checkInBtn.style.cursor = 'not-allowed';
          checkInBtn.style.opacity = '0.7';
          checkInBtn.textContent = 'Sudah Check In Hari Ini';
          if (statusEl) statusEl.textContent = '✅ Anda sudah melakukan check-in hari ini.';
        } else {
          checkInBtn.disabled = false;
          checkInBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          checkInBtn.style.cursor = 'pointer';
          checkInBtn.style.opacity = '1';
          checkInBtn.textContent = 'Check In Today';
          if (statusEl) statusEl.textContent = 'Klik untuk mencatat progres belajar hari ini.';
        }
      } else {
        const todayName = daysOrder[todayIdx];
        checkInBtn.disabled = true;
        checkInBtn.style.background = '#cccccc';
        checkInBtn.style.cursor = 'not-allowed';
        checkInBtn.style.opacity = '0.7';
        checkInBtn.textContent = 'Bukan Hari Belajar';
        if (statusEl) statusEl.textContent = `Hari ini (${todayName}) bukan hari belajar Anda.`;
      }
    } else {
      // No schedule set
      checkInBtn.disabled = true;
      checkInBtn.style.background = '#cccccc';
      checkInBtn.style.cursor = 'not-allowed';
      checkInBtn.style.opacity = '0.7';
      checkInBtn.textContent = 'Jadwal Belum Diset';
      if (statusEl) statusEl.textContent = 'Silakan atur jadwal belajar terlebih dahulu di halaman "Atur Jadwal".';
    }
  } catch (err) {
    console.error('Error checking study day:', err);
    checkInBtn.disabled = true;
    checkInBtn.style.background = '#cccccc';
    checkInBtn.style.cursor = 'not-allowed';
    checkInBtn.style.opacity = '0.7';
    checkInBtn.textContent = 'Error Memuat Jadwal';
    if (statusEl) statusEl.textContent = 'Gagal memuat data. Silakan refresh halaman.';
  }
}