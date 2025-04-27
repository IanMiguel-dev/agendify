// Controle de login simples
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simples verificação (pode ser trocado depois para algo mais seguro)
        if (username === "admin" && password === "1234") {
            localStorage.setItem('loggedIn', true);
            window.location.href = "index.html";
        } else {
            alert('Usuário ou senha incorretos!');
        }
    });
}

// Protege a página principal
if (document.body.classList.contains('dashboard-page')) {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = "login.html";
    }
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('loggedIn');
        window.location.href = "login.html";
    });
}

// Controle de agendamentos
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function renderAppointments() {
    const tbody = document.querySelector('#appointmentsTable tbody');
    tbody.innerHTML = '';

    // Ordenar por data mais próxima
    appointments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    appointments.forEach((appointment, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.phone}</td>
            <td>${appointment.email}</td>
            <td>${appointment.address}</td>
            <td>${new Date(appointment.dateTime).toLocaleString()}</td>
            <td>${appointment.observations || ''}</td>
            <td class="actions">
                <button class="edit" onclick="editAppointment(${index})">Editar</button>
                <button class="delete" onclick="deleteAppointment(${index})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function deleteAppointment(index) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        appointments.splice(index, 1);
        saveAppointments();
        renderAppointments();
    }
}

function editAppointment(index) {
    const appointment = appointments[index];

    document.getElementById('clientName').value = appointment.name;
    document.getElementById('clientPhone').value = appointment.phone;
    document.getElementById('clientEmail').value = appointment.email;
    document.getElementById('clientAddress').value = appointment.address;
    document.getElementById('appointmentDateTime').value = appointment.dateTime;
    document.getElementById('observations').value = appointment.observations;

    // Remover o agendamento atual para atualizar depois
    appointments.splice(index, 1);
    saveAppointments();
    renderAppointments();
}

const scheduleForm = document.getElementById('scheduleForm');
if (scheduleForm) {
    scheduleForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newAppointment = {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value,
            dateTime: document.getElementById('appointmentDateTime').value,
            observations: document.getElementById('observations').value
        };

        appointments.push(newAppointment);
        saveAppointments();
        renderAppointments();

        // Limpar o formulário
        scheduleForm.reset();
    });
}

// Campo de busca
const search = document.getElementById('search');
if (search) {
    search.addEventListener('input', function () {
        const searchTerm = search.value.toLowerCase();
        const filteredAppointments = appointments.filter(app =>
            app.name.toLowerCase().includes(searchTerm) ||
            app.phone.toLowerCase().includes(searchTerm) ||
            app.email.toLowerCase().includes(searchTerm) ||
            app.address.toLowerCase().includes(searchTerm)
        );

        const tbody = document.querySelector('#appointmentsTable tbody');
        tbody.innerHTML = '';

        filteredAppointments.forEach((appointment, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${appointment.name}</td>
                <td>${appointment.phone}</td>
                <td>${appointment.email}</td>
                <td>${appointment.address}</td>
                <td>${new Date(appointment.dateTime).toLocaleString()}</td>
                <td>${appointment.observations || ''}</td>
                <td class="actions">
                    <button class="edit" onclick="editAppointment(${index})">Editar</button>
                    <button class="delete" onclick="deleteAppointment(${index})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

// Inicializar a página carregando agendamentos
document.addEventListener('DOMContentLoaded', function () {
    if (document.body.classList.contains('dashboard-page')) {
        renderAppointments();
    }
});
