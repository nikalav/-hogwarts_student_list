"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
let showList = [];
let studentListLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";

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
    filterList("Ravenclaw");
  });
  document.querySelector(".slytherin").addEventListener("click", function() {
    filterList("Slytherin");
  });
  document.querySelector(".gryffindor").addEventListener("click", function() {
    filterList("Gryffindor");
  });
  document.querySelector(".hufflepuff").addEventListener("click", function() {
    filterList("Hufflepuff");
  });
  document.querySelector(".all").addEventListener("click", function() {
    filterList("all");
  });
  // document.querySelector(".showModal").addEventListener("click", function() {
  //   showDetails(showList, "modal");
  // });

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
function filterList(house) {
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

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
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
// function showDetails(students) {
//   console.log(students);

//   //	modal.querySelector("img").src =

//   modal.querySelector("h2").textContent = students.fullname;
//   modal.querySelector("h3").textContent = students.gender;
//   modal.querySelector("p").textContent = students.house;
//   modal.classList.remove("hide");
// }
