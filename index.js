// import axios from "axios";
const BASE_URL = 'http://localhost:3000/contacts'

window.onload = function() {

    let tbody = document.querySelector('#tbody')

    // Get Data From Server And Fill The Table When Page Loaded
    axios.get(BASE_URL)
        .then(res => {
            res.data.forEach(contact => {
                createTDElement(contact, tbody)
                // setInterval(function () {  console.log(contact.name);}, 3000)
            })
        })
        .catch()
        }

    // Add EventListener to Save Contact Button
    let saveContactBtn = document.querySelector('#saveContact')
    saveContactBtn.addEventListener('click', function(){
        createNewContact()
    })


// Create New Contact Function
function createNewContact() {
    let nameField = document.querySelector('#nameField')
    let phoneField = document.querySelector('#phoneField')
    let emailField = document.querySelector('#emailField')
    
    let contact = {
        name: nameField.value,
        phone: phoneField.value,
        email: emailField.value
    }

    axios.post(BASE_URL, contact)
        .then(res => {
            let tbody = document.querySelector('#tbody')
            createTDElement(res.data, tbody)

            nameField.value = ''
            phoneField.value = ''
            emailField.value = ''
        })
        .catch(err => console.log(err))
}




// Creating A TR Element and Appending to it's parent Element

function createTDElement(contact, parentElement) {

    const TR = document.createElement('tr')

    const tdName = document.createElement('td')
    tdName.innerHTML = contact.name
    TR.appendChild(tdName)

    const tdPhone = document.createElement('td')
    tdPhone.innerHTML = contact.phone ? contact.phone : 'N/A'
    TR.appendChild(tdPhone)

    const tdEmail = document.createElement('td')
    tdEmail.innerHTML = contact.email ? contact.email : 'N/A'
    TR.appendChild(tdEmail)

    const tdActions = document.createElement('td')

    const tdEditBtn = document.createElement('button')
    tdEditBtn.className = 'btn btn-warning'
    tdEditBtn.innerHTML = 'Edit'
    tdEditBtn.addEventListener('click', function() {
        
        let mainModal = $('#contactEditModal')
        mainModal.modal('toggle')

        let editName = document.querySelector('#edit-name')
        let editPhone = document.querySelector('#edit-phone')
        let editEmail = document.querySelector('#edit-email')

        editName.value = contact.name
        editPhone.value = contact.phone ? contact.phone : ''
        editEmail.value = contact.email ? contact.email : ''

        let updateBtn = document.querySelector('#updateContact')
        updateBtn.addEventListener('click', function(){
            axios.put(`${BASE_URL}/${contact.id}`, {
                name: editName.value,
                phone: editPhone.value,
                email: editEmail.value
            })
            .then(res => {
                tdName.innerHTML = res.data.name
                tdPhone.innerHTML = res.data.phone
                tdEmail.innerHTML = res.data.email

                mainModal.modal('hide')
            })
            .catch(err => console.log(err))
        })

    })
    tdActions.appendChild(tdEditBtn)

    const tdDeleteBtn = document.createElement('button')
    tdDeleteBtn.className = 'btn btn-danger mx-1'
    tdDeleteBtn.innerHTML = 'Delete'
    tdDeleteBtn.addEventListener('click', function(){
        
        axios.delete(`${BASE_URL}/${contact.id}`)
            .then(res => {
                parentElement.removeChild(TR)
            })
            .catch(err => console.log(err))

    })
    tdActions.appendChild(tdDeleteBtn)

    TR.appendChild(tdActions)

    parentElement.appendChild(TR)
}
