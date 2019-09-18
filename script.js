"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
let showList = [];
let studentListLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".closeBtn");

function start() {
  //add event-listeners for sorting
  document
    .querySelector(".firstNameSort")
    .addEventListener("click", function() {
      sortList(showList, "firstName");
    });
  document.querySelector(".lastNameSort").addEventListener("click", function() {
    sortList(showList, "lastName");
  });
  document.querySelector(".houseSort").addEventListener("click", function() {
    sortList(showList, "house");
  });

  //add event listeners for filter
  document.querySelector(".ravenclaw").addEventListener("click", function() {
    filterStudent("Ravenclaw");
  });
  document.querySelector(".slytherin").addEventListener("click", function() {
    filterStudent("Slytherin");
  });
  document.querySelector(".gryffindor").addEventListener("click", function() {
    filterStudent("Gryffindor");
  });
  document.querySelector(".hufflepuff").addEventListener("click", function() {
    filterStudent("Hufflepuff");
  });
  document.querySelector(".all").addEventListener("click", function() {
    filterStudent("all");
  });
  //modal
  modal.addEventListener("click", () => modal.classList.add("hide"));
  closeBtn.addEventListener("click", () => modal.classList.add("hide"));

  //expel
  document.querySelector("#list tbody").addEventListener("click", clickExpel);

  loadJSON();
}

function loadJSON() {
  fetch(studentListLink)
    .then(response => response.json())
    .then(jsonData => {
      prepareObj(jsonData);
    });
}

function prepareObj(jsonData) {
  jsonData.forEach(jsonObject => {
    //Create new object with cleaned data
    const student = Object.create(Student);

    let trimHouse = jsonObject.house.trim();
    student.house = capitalize(trimHouse);

    //split fullname
    let trimFullName = jsonObject.fullname.trim();
    let splitFullName = trimFullName.split(/[ ,.""-]+/);

    student.firstName = capitalize(splitFullName[0]);
    student.lastName = capitalize(splitFullName[splitFullName.length - 1]);

    allStudents.push(student);
    showList.push(student);
  });

  displayList(allStudents);
}
//arrange the names
function capitalize(str) {
  let cap = str[0].toUpperCase() + str.slice(1).toLowerCase();
  return cap;
}
function filterStudet(house) {
  showList = allStudents.filter(filterByHouse);
  function filterByHouse(student) {
    if (student.house === house || house === "all") {
      return true;
    } else {
      return false;
    }
  }
  displayList(showList);
}
function sortList(list, sortByCriteria) {
  list.sort((a, b) => {
    return a[sortByCriteria].localeCompare(b[sortByCriteria]);
  });
  displayList(list);
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student, index) {
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //stote the index on the button
  clone.querySelector("[data-action=expel]").dataset.index = index;

  clone
    .querySelector("[data-action=info]")
    .addEventListener("click", showModal);

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
//Prototype
const Student = {
  firstName: "-firstName-",
  lastName: "-lastName-",
  house: "-house-"
};

//modal
function showModal(student) {
  console.log(student);
  modal.querySelector("h2").textContent = student.firstName;
  // modal.querySelector("h2").textContent = student.lastName;
  modal.querySelector("h3").textContent = student.house;
  modal.classList.remove("hide");
}
//expel
function clickExpel(event) {
  const element = event.target; //the thing that was actually clicked

  if (element.dataset.action === "expel") {
    console.log("expel button clicked!");
    console.log(element);
    element.parentElement.parentElement.remove(); //remove action

    //get index of element to remove
    const index = element.dataset.index;
    showList.splice(index, 1);
    console.table(showList);
  }
}
