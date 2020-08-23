// import axios from "axios";
const BASE_URL = 'http://localhost:3000/contacts';

const tbody = document.querySelector('.table tbody');
const saveContactBtn = document.querySelector('#saveContact');

// Add EventListener to Save Contact Button
saveContactBtn.addEventListener('click', createNewContact);

// Create New Contact Function
async function createNewContact() {
  const name = document.querySelector('input[name=name]');
  const phone = document.querySelector('input[name=phome]');
  const email = document.querySelector('input[name=email]');

  try {
    const res = await axios.post(BASE_URL, {
      name: name.value,
      phone: phone.value,
      email: email.value,
    });

    createTDElement(res.data, tbody);

    name.value = '';
    phone.value = '';
    email.value = '';
  } catch (e) {
    console.log(e);
  }
}

// Creating A TR Element and Appending to it's parent Element
function createTDElement(contact, parentElement) {
  const TR = document.createElement('tr');

  const tdName = document.createElement('td');
  tdName.textContent = contact.name;
  TR.appendChild(tdName);

  const tdPhone = document.createElement('td');
  tdPhone.textContent = contact.phone ? contact.phone : 'N/A';
  TR.appendChild(tdPhone);

  const tdEmail = document.createElement('td');
  tdEmail.textContent = contact.email ? contact.email : 'N/A';
  TR.appendChild(tdEmail);

  const tdActions = document.createElement('td');

  const tdEditBtn = document.createElement('button');
  tdEditBtn.classList.add('btn', 'btn-warning');
  tdEditBtn.textContent = 'Edit';
  tdEditBtn.addEventListener('click', function () {
    const mainModal = $('#contactEditModal');
    mainModal.modal('toggle');

    const editName = document.querySelector('#edit-name');
    const editPhone = document.querySelector('#edit-phone');
    const editEmail = document.querySelector('#edit-email');

    editName.value = contact.name;
    editPhone.value = contact.phone ? contact.phone : '';
    editEmail.value = contact.email ? contact.email : '';

    const updateBtn = document.querySelector('#updateContact');
    updateBtn.addEventListener('click', async function () {
      try {
        const res = await axios.put(`${BASE_URL}/${contact.id}`, {
          name: editName.value,
          phone: editPhone.value,
          email: editEmail.value,
        });
        tdName.textContent = res.data.name;
        tdPhone.textContent = res.data.phone;
        tdEmail.textContent = res.data.email;

        mainModal.modal('hide');
      } catch (e) {
        console.log(e);
      }
    });
  });
  tdActions.appendChild(tdEditBtn);

  const tdDeleteBtn = document.createElement('button');
  tdDeleteBtn.className = 'btn btn-danger mx-1';
  tdDeleteBtn.textContent = 'Delete';
  tdDeleteBtn.addEventListener('click', async function () {
    try {
      const res = await axios.delete(`${BASE_URL}/${contact.id}`);
      parentElement.removeChild(TR);
    } catch (e) {
      console.log(e);
    }
  });

  tdActions.appendChild(tdDeleteBtn);
  TR.appendChild(tdActions);
  parentElement.appendChild(TR);
}

window.onload = async function () {
  // Get Data From Server And Fill The Table When Page Loaded
  const res = await axios.get(BASE_URL);
  for (const contact of res.data) {
    createTDElement(contact, tbody);
    // setInterval(function () {  console.log(contact.name);}, 3000)
  }
};
