// frontend/js/tasks.js
var API_BASE = window.API_BASE || "http://localhost:5001/api";
var USER_ID = localStorage.getItem('user_id');

if (!USER_ID) {
    alert('Please login first');
    window.location.href = '/login';
}

let currentFilter = 'all';
let allTasks = [];

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadStats();
    setupTaskForm();
});

// Setup task form
function setupTaskForm() {
    const form = document.getElementById('taskForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTask();
    });
}

// Load tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks?user_id=${USER_ID}`);
        const result = await response.json();

        if (result.success) {
            allTasks = result.data;
            renderTasks();
        } else {
            console.error('Failed to load tasks:', result.message);
            showError('Gagal memuat tugas');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Terjadi kesalahan saat memuat tugas');
    }
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/tasks/stats?user_id=${USER_ID}`);
        const result = await response.json();

        if (result.success) {
            const stats = result.data;
            document.getElementById('statTotal').textContent = stats.total || 0;
            document.getElementById('statPending').textContent = stats.pending || 0;
            document.getElementById('statInProgress').textContent = stats.in_progress || 0;
            document.getElementById('statCompleted').textContent = stats.completed || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Render tasks
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    let filteredTasks = allTasks;

    // Apply filter
    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>Tidak ada tugas ${currentFilter !== 'all' ? 'dengan status ini' : ''}.</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');
}

// Create task card HTML
function createTaskCard(task) {
    const dueDate = task.due_date ? new Date(task.due_date + 'T00:00:00') : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = dueDate && dueDate < today && task.status !== 'completed';

    const statusLabels = {
        'pending': 'Pending',
        'in_progress': 'In Progress',
        'completed': 'Completed'
    };

    const priorityLabels = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
    };

    return `
        <div class="task-card ${task.status === 'completed' ? 'completed' : ''}">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="task-priority priority-${task.priority}">${priorityLabels[task.priority]}</span>
                    <span class="task-status status-${task.status.replace('_', '-')}">${statusLabels[task.status]}</span>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-footer">
                <div class="task-due-date ${isOverdue ? 'overdue' : ''}">
                    ${dueDate ? `📅 ${formatDate(dueDate)} ${isOverdue ? '(Terlambat)' : ''}` : 'Tidak ada deadline'}
                </div>
                <div class="task-actions">
                    ${task.status !== 'completed' ? `<button class="btn-action btn-complete" onclick="completeTask(${task.id})">✓ Selesai</button>` : ''}
                    <button class="btn-action btn-edit" onclick="editTask(${task.id})">✏️ Edit</button>
                    <button class="btn-action btn-delete" onclick="deleteTask(${task.id})">🗑️ Hapus</button>
                </div>
            </div>
        </div>
    `;
}

// Filter tasks
function filterTasks(status) {
    currentFilter = status;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks();
}

// Open create modal
function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Tambah Tugas Baru';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('taskModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
}

// Edit task
async function editTask(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('modalTitle').textContent = 'Edit Tugas';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDueDate').value = task.due_date || '';

    document.getElementById('taskModal').classList.add('active');
}

// Save task (create or update)
async function saveTask() {
    const taskId = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (!title) {
        alert('Judul tugas harus diisi!');
        return;
    }

    try {
        let response;
        const payload = {
            user_id: USER_ID,
            title,
            description: description || null,
            priority,
            status,
            due_date: dueDate || null
        };

        if (taskId) {
            // Update
            response = await fetch(`${API_BASE}/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const result = await response.json();

        if (result.success) {
            closeModal();
            await loadTasks();
            await loadStats();
        } else {
            alert('Gagal menyimpan tugas: ' + (result.message || 'Terjadi kesalahan'));
        }
    } catch (error) {
        console.error('Error saving task:', error);
        alert('Terjadi kesalahan saat menyimpan tugas');
    }
}

// Complete task
async function completeTask(taskId) {
    if (!confirm('Tandai tugas ini sebagai selesai?')) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });

        const result = await response.json();

        if (result.success) {
            await loadTasks();
            await loadStats();
        } else {
            alert('Gagal mengupdate tugas');
        }
    } catch (error) {
        console.error('Error completing task:', error);
        alert('Terjadi kesalahan');
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Yakin ingin menghapus tugas ini?')) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            await loadTasks();
            await loadStats();
        } else {
            alert('Gagal menghapus tugas');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Terjadi kesalahan saat menghapus tugas');
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function showError(message) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
}

