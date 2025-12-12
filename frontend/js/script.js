// frontend/script.js
// Use global API_BASE if available, otherwise declare it
if (typeof window.API_BASE === 'undefined') {
  window.API_BASE = "http://localhost:5001/api";
}
const API_BASE = window.API_BASE;
const USER_ID = localStorage.getItem('user_id');
if (!USER_ID) {
  alert('Please login first');
  window.location.href = '/login';
}

const form = document.getElementById("scheduleForm");
const statusDiv = document.getElementById("status");
const noteField = document.getElementById("note");
const currentScheduleDiv = document.getElementById("currentSchedule");
const currentScheduleDaysDiv = document.getElementById("currentScheduleDays");
const currentScheduleNoteDiv = document.getElementById("currentScheduleNote");
const submitBtn = document.getElementById("submitBtn");

let currentTargetId = null; // untuk update data nanti

// Mapping hari
const dayMapping = {
  'Monday': 'Senin',
  'Tuesday': 'Selasa',
  'Wednesday': 'Rabu',
  'Thursday': 'Kamis',
  'Friday': 'Jumat',
  'Saturday': 'Sabtu',
  'Sunday': 'Minggu',
  'Senin': 'Senin',
  'Selasa': 'Selasa',
  'Rabu': 'Rabu',
  'Kamis': 'Kamis',
  'Jumat': 'Jumat',
  'Sabtu': 'Sabtu',
  'Minggu': 'Minggu'
};

// Normalize day name to Indonesian
function normalizeDayName(day) {
  return dayMapping[day] || day;
}

// 🔹 Fungsi: Ambil data dari API
async function loadExistingSchedule() {
  try {
    const res = await fetch(`${API_BASE}/targets?user_id=${USER_ID}`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      const target = data.data[0];
      currentTargetId = target.id;

      // Normalize days to Indonesian
      const targetDays = Array.isArray(target.days) 
        ? target.days.map(d => normalizeDayName(d))
        : [];

      // Centang checkbox sesuai data
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        const dayValue = cb.value;
        // Check if target days includes this day (handle both formats)
        const isChecked = targetDays.some(d => 
          normalizeDayName(d) === dayValue || 
          normalizeDayName(dayValue) === normalizeDayName(d)
        );
        cb.checked = isChecked;
        
        // Update visual state
        const dayOption = cb.closest('.day-option');
        if (dayOption) {
          if (isChecked) {
            dayOption.classList.add('checked');
          } else {
            dayOption.classList.remove('checked');
          }
        }
      });

      noteField.value = target.note || "";

      // Tampilkan jadwal saat ini
      displayCurrentSchedule(targetDays, target.note);
      
      statusDiv.innerHTML = "✅ <strong>Jadwal lama dimuat. Anda dapat mengubahnya di bawah.</strong>";
      statusDiv.style.color = "#667eea";
      statusDiv.style.background = "#e8f0fe";
      statusDiv.style.padding = "15px";
      statusDiv.style.borderRadius = "10px";
    } else {
      statusDiv.innerHTML = "📝 <strong>Belum ada jadwal tersimpan. Silakan buat jadwal baru di bawah.</strong>";
      statusDiv.style.color = "#666";
      statusDiv.style.background = "#f8f9fa";
      statusDiv.style.padding = "15px";
      statusDiv.style.borderRadius = "10px";
      currentScheduleDiv.style.display = 'none';
    }
  } catch (err) {
    console.error(err);
    statusDiv.innerHTML = "❌ <strong>Gagal memuat data. Silakan refresh halaman.</strong>";
    statusDiv.style.color = "#d32f2f";
    statusDiv.style.background = "#ffebee";
    statusDiv.style.padding = "15px";
    statusDiv.style.borderRadius = "10px";
  }
}

// Tampilkan jadwal saat ini
function displayCurrentSchedule(days, note) {
  if (days.length === 0) {
    currentScheduleDiv.style.display = 'none';
    return;
  }

  currentScheduleDiv.style.display = 'block';
  currentScheduleDaysDiv.innerHTML = '';
  
  days.forEach(day => {
    const dayName = normalizeDayName(day);
    const badge = document.createElement('div');
    badge.className = 'schedule-day-badge';
    badge.textContent = dayName;
    currentScheduleDaysDiv.appendChild(badge);
  });

  if (note && note.trim()) {
    currentScheduleNoteDiv.textContent = `📝 ${note}`;
    currentScheduleNoteDiv.style.display = 'block';
  } else {
    currentScheduleNoteDiv.textContent = '';
    currentScheduleNoteDiv.style.display = 'none';
  }
}

// Setup checkbox visual feedback
document.addEventListener('DOMContentLoaded', () => {
  const dayOptions = document.querySelectorAll('.day-option');
  dayOptions.forEach(option => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const label = option.querySelector('label');
    
    // Click on option container
    option.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      updateDayOptionStyle(option, checkbox);
    });
    
    // Click on checkbox
    checkbox.addEventListener('change', () => {
      updateDayOptionStyle(option, checkbox);
    });
    
    // Initialize style
    updateDayOptionStyle(option, checkbox);
  });
});

function updateDayOptionStyle(option, checkbox) {
  if (checkbox.checked) {
    option.classList.add('checked');
  } else {
    option.classList.remove('checked');
  }
}

// 🔹 Fungsi: Simpan atau update jadwal
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedDays = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
  const note = noteField.value.trim();

  if (selectedDays.length === 0) {
    statusDiv.innerHTML = "⚠️ <strong>Pilih minimal satu hari belajar!</strong>";
    statusDiv.style.color = "#d32f2f";
    statusDiv.style.background = "#ffebee";
    statusDiv.style.padding = "15px";
    statusDiv.style.borderRadius = "10px";
    return;
  }

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Menyimpan...';

  const payload = {
    user_id: USER_ID,
    days: selectedDays,
    note: note
  };

  try {
    let response;

    if (currentTargetId) {
      const putPayload = { days: selectedDays, note: note };
      response = await fetch(`${API_BASE}/targets/${currentTargetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(putPayload)
      });
    } else {
      // create new target
      response = await fetch(`${API_BASE}/targets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const data = await response.json();

    if (data.success) {
      statusDiv.innerHTML = "✅ <strong>Jadwal berhasil disimpan! Mengalihkan ke dashboard...</strong>";
      statusDiv.style.color = "#2e7d32";
      statusDiv.style.background = "#e8f5e9";
      statusDiv.style.padding = "15px";
      statusDiv.style.borderRadius = "10px";
      currentTargetId = data.data.id || currentTargetId;

      // Clear cache untuk refresh data
      localStorage.removeItem('local_target');
      localStorage.removeItem('local_actual');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      statusDiv.innerHTML = `⚠️ <strong>Gagal menyimpan jadwal: ${data.message || 'Terjadi kesalahan'}</strong>`;
      statusDiv.style.color = "#d32f2f";
      statusDiv.style.background = "#ffebee";
      statusDiv.style.padding = "15px";
      statusDiv.style.borderRadius = "10px";
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Simpan Jadwal';
    }

  } catch (err) {
    console.error(err);
    statusDiv.innerHTML = "❌ <strong>Terjadi kesalahan koneksi. Periksa koneksi internet Anda.</strong>";
    statusDiv.style.color = "#d32f2f";
    statusDiv.style.background = "#ffebee";
    statusDiv.style.padding = "15px";
    statusDiv.style.borderRadius = "10px";
    submitBtn.disabled = false;
    submitBtn.textContent = '💾 Simpan Jadwal';
  }
});

// 🔹 Jalankan saat halaman dibuka
loadExistingSchedule();
