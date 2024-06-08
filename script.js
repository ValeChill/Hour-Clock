// create a variable that accesses the div where the hour will be displayed
const hourDisplay = document.querySelector(".hour");
// create variable for chime sound
const hourChime = document.querySelector("#hour-chime");
// to-do list variables
const toggleButton = document.querySelector(".toggle-button");
const toDoContainer = document.querySelector("#to-do-container");
const toDoList = document.querySelector("#to-do-list");
const toDo = document.querySelector("#to-do");
const toDoForm = document.querySelector("#to-do-form");

// list of to-do items and status
let toDoEntries = [];

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
function addToDoItem(event) {
  event.preventDefault();
  const toDoItem = toDo.value;
  if (toDoItem) {
    displayNewToDo(toDoItem);
    toDoEntries.push({item: toDoItem, value: false});
    toDo.value = "";
    saveToDoList();
  }
}

function displayNewToDo(text, complete=false) {
  const listDiv = document.createElement("div");
  const deleteButton = document.createElement("button");
  const checkbox = document.createElement("input");
  const li = document.createElement("li");

  listDiv.classList.add("list-item");
  deleteButton.textContent = "✖️";
  deleteButton.classList.add("delete-button");
  checkbox.type = "checkbox";

  if (complete==true) {
    checkbox.checked = true;
    li.style.textDecoration = "line-through";
    li.style.color = "gray";
  }

  listDiv.appendChild(checkbox);
  li.textContent = text;
  listDiv.appendChild(li);
  listDiv.appendChild(deleteButton);
  toDoList.appendChild(listDiv);
}

// remove to-do item from the list
function removeToDoItem(e) {
  if (e.target.classList.contains("delete-button")) {
    e.target.parentElement.remove();
    // find item in to do list entries, delete it, save updated list
    // find item in toDoEntries
    let toDoText = e.target.parentElement.querySelector('li').textContent;
    let entry = toDoEntries.findIndex((entry) => entry['item'] === toDoText);
    if (entry == 0) {
      toDoEntries.shift();
    } else if (entry == toDoEntries.length - 1) {
      toDoEntries.pop();
    } else {
      toDoEntries.splice(entry, 1);
    }
    saveToDoList();
  }
}

// line through to-do item when checkbox is checked
function lineThrough(e) {
  let toDoText = e.target.parentElement.querySelector('li').textContent;
  let entry = toDoEntries.findIndex((entry) => entry['item'] === toDoText);
  if (e.target.checked) {
    e.target.nextElementSibling.style.textDecoration = "line-through";
    e.target.nextElementSibling.style.color = "gray";
    toDoEntries[entry]['value'] = true;
  } else {
    e.target.nextElementSibling.style.textDecoration = "none";
    e.target.nextElementSibling.style.color = "black";
    toDoEntries[entry]['value'] = false;
  }

  saveToDoList();
}

// save to-do list to local storage
function saveToDoList() {
  localStorage.setItem("toDoList", JSON.stringify(toDoEntries));
}

// load to-do list from local storage
function loadToDoList() {
  let toDoListItems = localStorage.getItem("toDoList");
  if (toDoListItems) {
    toDoListItems = JSON.parse(toDoListItems);
    toDoListItems.forEach((item) => {
      toDoEntries.push(item);
      displayNewToDo(item['item'], item['value']);
    });
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
toDoForm.addEventListener("submit", addToDoItem);
toDoList.addEventListener("click", removeToDoItem);
toDoList.addEventListener("change", lineThrough);
