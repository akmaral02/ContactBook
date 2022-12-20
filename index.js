let userName = document.querySelector("#name");
let userSurname = document.querySelector("#surname");
let userNumber = document.querySelector("#number");
let addBtn = document.querySelector("#add");
const inpEditName = document.querySelector(".inp-edit-name");
const inpEditImg = document.querySelector(".inp-edit-img");
const inpEditSurname = document.querySelector(".inp-edit-surname");
const inpEditNumber = document.querySelector(".inp-edit-number");
const modal = document.querySelector(".main-modal");
const saveBtn = document.querySelector(".btn-save");
const closeBtn = document.querySelector(".btn-closer");
const img1 = document.querySelector("#image");

render();

addBtn.addEventListener("click", async function () {
  if (
    !userName.value.trim() &&
    !userSurname.value.trim() &&
    !userNumber.value.trim()
  ) {
    alert("Заполните поле!!!");
    return;
  }
  let newContact = {
    name: userName.value,
    surname: userSurname.value,
    number: userNumber.value,
    img: img1.value,
  };
  await setContact(newContact);
  render();
  userName.value = "";
  userSurname.value = "";
  userNumber.value = "";
});

async function setContact(newContact) {
  const options = {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch("http://localhost:8001/contact", options);
}

async function render() {
  const newContact = await getDataFromJSON();
  const generalInfo = document.createElement("div");
  generalInfo.classList.add("general-info");
  generalInfo.innerHTML = "";
  newContact.forEach((item) => {
    const newImg = document.createElement("img");
    newImg.src = item.img;
    newImg.style.height = "200px";
    newImg.style.width = "200px";
    const newUser = document.createElement("div");
    newUser.classList.add("col-md-4");
    newUser.classList.add("new-user");
    const newUserName = document.createElement("p");
    const newUserSurname = document.createElement("p");
    const newUserNumber = document.createElement("p");
    newUserName.innerText = `Name: ${item.name}`;
    newUserSurname.innerText = `Surname: ${item.surname}`;
    newUserNumber.innerText = `Phone Number: ${item.number}`;
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit");
    btnEdit.addEventListener("click", function (e) {
      e.stopPropagation();
      editContact(item.id);
    });
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete");
    btnDelete.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteContact(item.id);
    });
    btnEdit.innerText = "Edit";
    btnDelete.innerText = "Delete";
    newUser.append(newImg);
    newUser.append(newUserName);
    newUser.append(newUserSurname);
    newUser.append(newUserNumber);
    newUser.append(btnEdit);
    newUser.append(btnDelete);
    generalInfo.append(newUser);
    document.body.append(generalInfo);
  });
}

async function getDataFromJSON() {
  const data = await fetch("http://localhost:8001/contact");
  const result = await data.json();
  return result;
}

async function deleteContact(id) {
  const options = {
    method: "DELETE",
  };
  await fetch(`http://localhost:8001/contact/${id}`, options);
  render();
}

async function editContact(id) {
  const response = await fetch(`http://localhost:8001/contact/${id}`);
  const editContact = await response.json();
  modal.style.display = "block";
  inpEditImg.value = editContact.img;
  inpEditName.value = editContact.name;
  inpEditSurname.value = editContact.surname;
  inpEditNumber.value = editContact.number;
  saveBtn.addEventListener("click", async function () {
    if (
      !inpEditName.value.trim() &&
      !inpEditSurname.value.trim() &&
      !inpEditNumber.value.trim()
    ) {
      alert("Заполните поле!!!");
      return;
    }

    modal.style.display = "none";
    const options = {
      method: "PATCH",
      body: JSON.stringify({
        img: inpEditImg.value,
        name: inpEditName.value,
        surname: inpEditSurname.value,
        number: inpEditNumber.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    await fetch(`http://localhost:8001/contact/${id}`, options);
    render();
  });
}

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});
