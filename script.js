// create a variable that accesses the div where the hour will be displayed
const hourDisplay = document.querySelector(".hour");
// create variable for chime sound
const hourChime = document.querySelector("#hour-chime");
// to-do list variables
const toggleButton = document.querySelector(".toggle-button");
const toDoContainer = document.querySelector("#to-do-container");
const toDoList = document.querySelector("#to-do-list");
const toDo = document.querySelector("#to-do");
const addToDo = document.querySelector("#add-to-do");

function updateTime() {
  // store the current time in a variable
  const time = new Date();
  // get the current hour (24 hour format)
  let h = time.getHours();
  let midday = "am";

  // if it's after 12pm, change midday variable to pm and substract 12 from hour
  //Fix for 12pm and 12am -> was 12am and 0am before.
  if (h >= 12) {
    h = h === 12 ? h : h - 12;
    midday = "pm";
  } else if (h === 0) {
    h = 12;
  }

  // string containing the hour and am/pm
  let timeDisplay = `${h}${midday}`;

  // update the display if the hour has changed since last time the code ran
  if (hourDisplay.textContent != timeDisplay) {
    setHourDisplay(timeDisplay);
  }

  // play chime sound every hour
  if (time.getMinutes() === 0 && time.getSeconds() === 0) {
    hourChime.play();
  }

  // wait for one second, then run this code again
  setTimeout(updateTime, 1000);
}

function setHourDisplay(timeDisplay) {
  // set hourDisplay content to timeDisplay
  hourDisplay.textContent = timeDisplay;
}

// show or hide the to-do form
function toggleToDo() {
  toDoContainer.classList.toggle("hidden");
}

// add to-do item to the list
function addToDoItem() {
  const toDoItem = toDo.value;
  if (toDoItem) {
    const listDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    const checkbox = document.createElement("input");
    const li = document.createElement("li");

    listDiv.classList.add("list-item");
    deleteButton.textContent = "✖️";
    deleteButton.classList.add("delete-button");
    checkbox.type = "checkbox";

    listDiv.appendChild(checkbox);
    li.textContent = toDoItem;
    listDiv.appendChild(li);
    listDiv.appendChild(deleteButton);
    toDoList.appendChild(listDiv);
    toDo.value = "";
    saveToDoList();
  }
}

// remove to-do item from the list
function removeToDoItem(e) {
  if (e.target.classList.contains("delete-button")) {
    e.target.parentElement.remove();
    saveToDoList();
  }
}

// line through to-do item when checkbox is checked
function lineThrough(e) {
  if (e.target.checked) {
    e.target.nextElementSibling.style.textDecoration = "line-through";
    e.target.nextElementSibling.style.color = "gray";
  } else {
    e.target.nextElementSibling.style.textDecoration = "none";
    e.target.nextElementSibling.style.color = "black";
  }

  saveToDoList();
}

// save to-do list to local storage
function saveToDoList() {
  localStorage.setItem("toDoList", toDoList.innerHTML);
}

// load to-do list from local storage
function loadToDoList() {
  const toDoListItems = localStorage.getItem("toDoList");
  if (toDoListItems) {
    toDoList.innerHTML = toDoListItems;
  }
}

// run the updateTime function when the page loads
updateTime();

// run the loadToDoList function when the page loads
loadToDoList();

// add event listeners to the buttons
toggleButton.addEventListener("click", toggleToDo);
addToDo.addEventListener("click", addToDoItem);
toDoList.addEventListener("click", removeToDoItem);
toDoList.addEventListener("change", lineThrough);
