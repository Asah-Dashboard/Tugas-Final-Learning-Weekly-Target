// frontend/log_progress.js

document.addEventListener('DOMContentLoaded', () => {
  // Use global API_BASE if available, otherwise declare it
  if (typeof window.API_BASE === 'undefined') {
    window.API_BASE = "http://localhost:5001/api";
  }
  const API_BASE = window.API_BASE;
  const USER_ID = localStorage.getItem('user_id');
  const form = document.getElementById('logForm');
  const noteEl = document.getElementById('logNote');
  const statusEl = document.getElementById('statusMessage');
  const btn = document.getElementById('logBtn');
  const tasksSection = document.getElementById('tasksSection');
  const tasksList = document.getElementById('tasksList');

  if (!USER_ID) {
    alert('Please login first');
    window.location.href = '/login';
    return;
  }

  if (!form) return;

  // Load tasks
  loadTasksForLog();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
    }
    if (statusEl) statusEl.textContent = 'Mengirim...';

    const today = new Date().toLocaleDateString('sv-SE');
    
    // Get selected task IDs
    const selectedTaskIds = [];
    document.querySelectorAll('input[type="checkbox"][name="completed_tasks"]:checked').forEach(cb => {
      selectedTaskIds.push(parseInt(cb.value));
    });
    
    const payload = {
      user_id: USER_ID,
      log_date: today,
      notes: noteEl ? noteEl.value.trim() : '',
      related_task_ids: selectedTaskIds.length > 0 ? selectedTaskIds : null
    };

    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        // tandai ke dashboard: hanya perlu tanggal ISO
        try {
          localStorage.setItem('just_logged', today);
          localStorage.setItem('checked_in_today', today);
          // update cached actual array (Senin..Minggu)
          try {
            const daysOrder = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
            const saved = JSON.parse(localStorage.getItem('local_actual') || 'null') || Array(7).fill(0);
            const todayIdx = (new Date().getDay() + 6) % 7; // map JS 0..6 -> Senin..Minggu idx
            saved[todayIdx] = 1;
            localStorage.setItem('local_actual', JSON.stringify(saved));
          } catch (e) { /* ignore */ }
        } catch (e) { /* ignore storage errors */ }
        
        // Show success message with task completion info
        let successMsg = 'Sukses: progres tercatat.';
        if (selectedTaskIds.length > 0) {
          successMsg += ` ${selectedTaskIds.length} tugas ditandai selesai.`;
        }
        successMsg += ' Mengalihkan ke dasbor...';
        
        if (statusEl) {
          statusEl.textContent = successMsg;
          statusEl.style.color = 'green';
        }
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        if (statusEl) statusEl.textContent = json.message || 'Gagal mencatat progres';
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.textContent = 'Koneksi gagal. Coba lagi.';
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    }
  });

  // Load tasks function
  async function loadTasksForLog() {
    try {
      // Get pending and in_progress tasks
      const pendingResponse = await fetch(`${API_BASE}/tasks?user_id=${USER_ID}&status=pending`);
      const inProgressResponse = await fetch(`${API_BASE}/tasks?user_id=${USER_ID}&status=in_progress`);
      
      const pendingResult = await pendingResponse.json();
      const inProgressResult = await inProgressResponse.json();
      
      const allTasks = [
        ...(pendingResult.success ? pendingResult.data : []),
        ...(inProgressResult.success ? inProgressResult.data : [])
      ];
      
      if (allTasks.length > 0) {
        tasksSection.style.display = 'block';
        tasksList.innerHTML = allTasks.map(task => {
          // Parse due_date safely
          let dueDateDisplay = '';
          if (task.due_date) {
            try {
              let dateStr = task.due_date;
              let dateObj;
              
              // If it's already a Date object
              if (dateStr instanceof Date) {
                dateObj = dateStr;
              } else if (typeof dateStr === 'string') {
                // Try parsing as ISO date (YYYY-MM-DD)
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  dateObj = new Date(dateStr + 'T00:00:00');
                } else {
                  dateObj = new Date(dateStr);
                }
              }
              
              // Validate and format the date
              if (dateObj && !isNaN(dateObj.getTime())) {
                dueDateDisplay = `<span style="font-size: 0.75rem; color: #666;">📅 ${formatDate(dateObj)}</span>`;
              }
            } catch (error) {
              console.error('Error parsing due_date:', error);
            }
          }
          
          return `
          <label style="display: flex; align-items: center; padding: 10px; margin-bottom: 8px; background: white; border-radius: 8px; cursor: pointer; border: 2px solid #e0e0e0; transition: all 0.3s ease;">
            <input type="checkbox" name="completed_tasks" value="${task.id}" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #333;">${escapeHtml(task.title)}</div>
              ${task.description ? `<div style="font-size: 0.85rem; color: #666; margin-top: 4px;">${escapeHtml(task.description.substring(0, 100))}${task.description.length > 100 ? '...' : ''}</div>` : ''}
              <div style="display: flex; gap: 8px; margin-top: 6px;">
                <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: ${task.priority === 'high' ? '#ffebee' : task.priority === 'medium' ? '#fff3e0' : '#e8f5e9'}; color: ${task.priority === 'high' ? '#c62828' : task.priority === 'medium' ? '#f57c00' : '#2e7d32'}; font-weight: 600;">
                  ${task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                </span>
                ${dueDateDisplay}
              </div>
            </div>
          </label>
        `;
        }).join('');

        // Add hover effect
        tasksList.querySelectorAll('label').forEach(label => {
          label.addEventListener('mouseenter', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
          });
          label.addEventListener('mouseleave', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
          });
        });
      } else {
        tasksList.innerHTML = '<p style="text-align: center; color: #999; margin: 10px 0;">Tidak ada tugas pending atau in-progress.</p>';
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      tasksList.innerHTML = '<p style="text-align: center; color: #999; margin: 10px 0;">Gagal memuat tugas.</p>';
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(date) {
    // Validate date before formatting
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Tanggal tidak valid';
    }
    
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  }
});