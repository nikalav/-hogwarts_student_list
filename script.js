"use strict";

window.addEventListener("DOMContentLoaded", start);

//describing lists
const allStudents = [];
//to contain expelled student list
const expelledList = [];
const studentList = [];
let showList = studentList.concat(expelledList);
//json links
let studentListLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
//for modal
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
  document.querySelector("#studentExpelled").innerHTML = expelledList.length;

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

    //to show full name in modal
    student.firstName = capitalize(splitFullName[0]);
    if (splitFullName.length === 1) {
      //if there is no last name show spaces
      student.lastName = "";
    } else if (splitFullName.length === 2) {
      student.lastName = capitalize(splitFullName[1]);
    } else if (splitFullName.length === 3) {
      student.middleName = capitalize(splitFullName[1]);
      student.lastName = capitalize(splitFullName[2]);
    }
    // student.lastName = capitalize(splitFullName[splitFullName.length - 1]);

    allStudents.push(student);
    showList.push(student);
    student.id = uuidv4();
    document.querySelector("#studentCount").innerHTML =
      "Student:" + " " + showList.length; //??
    document.querySelector("#studentExpelled").innerHTML =
      "Expelled:" + " " + expelledList.length;
  });

  displayList(allStudents);
}
//arrange the names
function capitalize(str) {
  let cap = str[0].toUpperCase() + str.slice(1).toLowerCase();
  return cap;
}
function filterStudent(house) {
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

  //state the index on the button
  clone.querySelector("[data-action=expel]").dataset.index = index;

  clone
    .querySelector("[data-action=info]")
    .addEventListener("click", function() {
      showModal(student);
    });
  let expelStudent = expelledList.find(stud => stud.id === student.id);
  if (expelStudent !== undefined) {
    clone.querySelector("[data-field=expeledStatus]").textContent =
      student.expel;
    clone.querySelector("[data-action=expel]").parentElement.remove();
  } else if (expelStudent === undefined) {
    clone.querySelector("[data-action=expel]").dataset.attribute = student.id;
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
//Prototype
const Student = {
  firstName: "-firstName-",
  middleName: "-middleName-",
  lastName: "-lastName-",
  house: "-house-",
  id: "-uuid-"
};

//modal
function showModal(student) {
  console.log(student);
  modal.querySelector("h2").textContent =
    student.firstName + " " + student.middleName + " " + student.lastName;
  // modal.querySelector("h2").textContent = student.lastName;
  modal.querySelector("p").textContent = student.house;
  modal.classList.remove("hide");
  let expelStudent = expelledList.find(stud => stud.id === `${student.id}`);
}
//expel
function clickExpel(event) {
  const element = event.target; //the thing that was actually clicked
  const uuid = element.dataset.attribute;
  if (element.dataset.action === "expel") {
    console.log("expel button clicked!");
    console.log(element);
    element.parentElement.parentElement.remove(); //remove action
    let expelStudent = studentList.find(student => student.id === uuid);

    element.value = "EXPELLED";
    element.disabled = "true";
    expelledList.push(expelStudent);
    //get index of element to remove
    const index = element.dataset.index;
    showList.splice(index, 1);
    console.table(showList);

    //Get data-attribute from the button

    //show student number
    document.querySelector("#studentCount").innerHTML =
      "Student:" + " " + showList.length; //??
    document.querySelector("#studentExpelled").innerHTML =
      "Expelled:" + " " + expelledList.length;
  }
}
// uuid src: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log(uuidv4());
