// delete_account.js
const openModalBtn = document.getElementById('openDeleteModal');
const modal = document.getElementById('deleteModal');
const cancelBtn = document.getElementById('cancelDelete');
const confirmInput = document.getElementById('confirmInput');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Open modal
openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

// Close modal
cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    confirmInput.value = '';
    confirmDeleteBtn.disabled = true;
});

// Enable delete button only if input === 'DELETE'
confirmInput.addEventListener('input', () => {
    confirmDeleteBtn.disabled = confirmInput.value !== 'DELETE';
});
