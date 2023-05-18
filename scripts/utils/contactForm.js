const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let formValue = {
    name: "",
    surname: "",
    email: "",
    message: ""
}

document.querySelector("#form_section").setAttribute("aria-label", "Contact me")

//handle close icon
document.querySelector(".close").addEventListener("click", closeModal)

//handle email input
const emailIpt = document.querySelector("#email")
emailIpt.addEventListener("input", ({target: {value: email}}) => {
    const isValid = email.match(emailRegex)
    setInputError("email", isValid)
    formValue.email = isValid ? email : ""
})

//handle name input
const nameIpt = document.querySelector("#name")
nameIpt.addEventListener("input", ({target: {value: name}}) => {
    setInputError("name", name.length > 2)
    formValue.name = name
})

//handle surname input
const surnameIpt = document.querySelector("#surname")
surnameIpt.addEventListener("input", ({target: {value: surname}}) => {
    setInputError("surname", surname.length > 2)
    formValue.surname = surname
})

//handle message
const messageIpt = document.querySelector("#message")

messageIpt.addEventListener("input", ({target: {value: message}}) => {
    formValue.message = message
})


//handle submit
const submitBtn = document.querySelector(".form_submit")

submitBtn.addEventListener("click", (e) => {
    let valid = true
    e.preventDefault()
    for (const prop in formValue) {
        switch (prop) {
            case "name":
                if (formValue[prop].length < 2) {
                    setInputError(prop, false)
                    valid = false
                }
                break
            case "surname":
                if (formValue[prop].length < 2) {
                    setInputError(prop, false)
                    valid = false
                }
                break
            case "message":
                if (formValue[prop].length < 2) {
                    setInputError(prop, false)
                    valid = false
                }
                break
            case "email":
                if (!formValue[prop].match(emailRegex)) {
                    setInputError(prop, false)
                    valid = false
                }
                break
        }
    }

    if(valid) {
        console.log(formValue)
        closeModal()
        document.querySelector(".contact_form").reset()
        formValue = {
            name: "",
            surname: "",
            email: "",
            message: ""
        }
    }
})
function displayModal() {
    const modal = document.getElementById("form_section");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("form_section");
    modal.style.display = "none";
}

function setInputError(inputName, isValid) {
    if (!isValid) {
        document.querySelector(`.${inputName}-error`).style.display = "block"
        document.querySelector(`#${inputName}`).classList.add("input-error")
        return
    }
    document.querySelector(`.${inputName}-error`).style.display = "none"
    document.querySelector(`#${inputName}`).classList.remove("input-error")
}
