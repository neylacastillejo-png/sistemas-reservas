let reservations = JSON.parse(localStorage.getItem('event_reservations')) || [];

const form = document.getElementById('reservation-form');
const formTitle = document.getElementById('form-title');
const editIndexInput = document.getElementById('edit-index');
const nameInput = document.getElementById('client-name');
const eventInput = document.getElementById('event-type');
const dateInput = document.getElementById('event-date');
const guestsInput = document.getElementById('guest-count');
const phoneInput = document.getElementById('client-phone');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const searchInput = document.getElementById('search-input');
const reservationsList = document.getElementById('reservations-list');
const totalCount = document.getElementById('total-count');
const toast = document.getElementById('toast');

document.addEventListener('DOMContentLoaded', () => renderTable());

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const reservationData = {
    name: nameInput.value.trim(),
    event: eventInput.value,
    date: dateInput.value,
    guests: parseInt(guestsInput.value, 10),
    phone: phoneInput.value.trim()
  };

  const editIndex = parseInt(editIndexInput.value, 10);

  if (editIndex === -1) {
    reservations.push(reservationData);
    showToast('Reserva registrada exitosamente', 'success');
  } else {
    reservations[editIndex] = reservationData;
    showToast('Reserva actualizada correctamente', 'warning');
    resetFormState();
  }

  saveAndRefresh();
  form.reset();
});

function renderTable(filterText = '') {
  reservationsList.innerHTML = '';
  const filtered = reservations.filter(res => res.name.toLowerCase().includes(filterText.toLowerCase()));
  totalCount.textContent = `${filtered.length} Total`;

  if (filtered.length === 0) {
    reservationsList.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#6b7280;">No hay reservas registradas.</td></tr>`;
    return;
  }

  filtered.forEach((res) => {
    const originalIndex = reservations.indexOf(res);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(res.name)}</strong></td>
      <td><span class="badge">${escapeHtml(res.event)}</span></td>
      <td>${formatDate(res.date)}</td>
      <td>${res.guests} personas</td>
      <td>${escapeHtml(res.phone)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-sm btn-edit" onclick="editReservation(${originalIndex})">Editar</button>
          <button class="btn btn-sm btn-delete" onclick="deleteReservation(${originalIndex})">Eliminar</button>
        </div>
      </td>
    `;
    reservationsList.appendChild(tr);
  });
}

window.editReservation = function(index) {
  const res = reservations[index];
  editIndexInput.value = index;
  nameInput.value = res.name;
  eventInput.value = res.event;
  dateInput.value = res.date;
  guestsInput.value = res.guests;
  phoneInput.value = res.phone;

  formTitle.textContent = 'Editar Reserva';
  btnSubmit.textContent = 'Actualizar Reserva';
  btnCancel.style.display = 'block';
};

window.deleteReservation = function(index) {
  if (confirm(`¿Eliminar la reserva de ${reservations[index].name}?`)) {
    reservations.splice(index, 1);
    saveAndRefresh();
    showToast('Reserva eliminada', 'danger');
  }
};

searchInput.addEventListener('input', (e) => renderTable(e.target.value));

btnCancel.addEventListener('click', () => {
  form.reset();
  resetFormState();
});

function resetFormState() {
  editIndexInput.value = -1;
  formTitle.textContent = 'Nueva Reserva';
  btnSubmit.textContent = 'Guardar Reserva';
  btnCancel.style.display = 'none';
}

function saveAndRefresh() {
  localStorage.setItem('event_reservations', JSON.stringify(reservations));
  renderTable(searchInput.value);
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}
