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
// settings variables
const settingsButton = document.querySelector(".settings-button");
const settingsContainer = document.querySelector("#settings-container");

function getHourString(time) {
  let h = time.getHours();
  let midday = "am";

  // if it's after 12pm, change midday variable to pm and substract 12 from hour
  // Fix for 12pm and 12am -> was 12am and 0am before.
  if (h >= 12) {
    h = h === 12 ? h : h - 12;
    midday = "pm";
  } else if (h === 0) {
    h = 12;
  }

  return `${h}${midday}`;
}

function updateTime() {
  // store the current time in a variable
  const time = new Date();

  timeDisplay = getHourString(time);

  // run hour-change events if hour has changed since last time code ran
  hourDisplay.textContent != timeDisplay ? onNewHour(timeDisplay) : null;

  // wait for one second, then run this code again
  setTimeout(updateTime, 1000);
}

function onNewHour(timeDisplay) {
  setHourDisplay(timeDisplay);
  // hourChime volume reduced so it's less disruptive to user workflow
  hourChime.volume = 0.7;
  hourChime.play();
}

function setHourDisplay(timeDisplay) {
  // set hourDisplay content to timeDisplay
  hourDisplay.textContent = timeDisplay;
}

// show or hide the to-do form
function toggleToDo() {
  toDoContainer.classList.toggle("hidden");
  // if settings form is not hidden, hide it
  if (settingsContainer.classList.contains("hidden") === false) {
    settingsContainer.classList.add("hidden");
  }
}

// show or hide the settings form
function toggleSettings() {
  settingsContainer.classList.toggle("hidden");
  // if to-do form is not hidden, hide it
  if (toDoContainer.classList.contains("hidden") === false) {
    toDoContainer.classList.add("hidden");
  }
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

// set the time and run the updateTime function when the page loads
setHourDisplay(getHourString(new Date()));
updateTime();

// run the loadToDoList function when the page loads
loadToDoList();

// add event listeners to the buttons
toggleButton.addEventListener("click", toggleToDo);
settingsButton.addEventListener("click", toggleSettings);
addToDo.addEventListener("click", addToDoItem);
toDoList.addEventListener("click", removeToDoItem);
toDoList.addEventListener("change", lineThrough);
