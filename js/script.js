// import colors
import { themes } from "../config/config.js";

// create a variable that accesses the div where the hour will be displayed
const hourDisplay = document.querySelector(".hour");
const clock = document.querySelector(".clock");
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
const colorButtons = document.querySelectorAll(".color-button");
const hideCheckbox = document.querySelector("#hide-everything");
const borderCheckbox = document.querySelector("#border-toggle");
const chimeCheckbox = document.querySelector("#chime-toggle");

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

  let timeDisplay = getHourString(time);

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

// change colors via button clicks
function changeColor(value = themes.default) {
  const color = value;
  Object.keys(color).forEach((colorKey) => {
    document.documentElement.style.setProperty(
      `--${colorKey}`,
      color[colorKey]
    );
  });
}

// check if the window is in fullscreen mode and hide elements if it is
function checkFullscreen() {
  if (hideCheckbox.checked) {
    if (!window.screenTop && !window.screenY) {
      toggleButton.classList.add("hidden");
      settingsButton.classList.add("hidden");
      settingsContainer.classList.add("hidden");
      clock.style.border = "none";
      clock.style.backgroundColor = "transparent";
      clock.style.boxShadow = "none";
    } else {
      toggleButton.classList.remove("hidden");
      settingsButton.classList.remove("hidden");
      clock.style.border = "3px solid var(--clock-border-color)";
      clock.style.backgroundColor = "var(--clock-background-color)";
      clock.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    }
  }

  setTimeout(checkFullscreen, 1000);
}

// set the time and run the updateTime function when the page loads
setHourDisplay(getHourString(new Date()));
updateTime();

// run the changeColor function when the page loads so default colors are set
changeColor();

// run the loadToDoList function when the page loads
loadToDoList();

// add event listeners to the buttons
toggleButton.addEventListener("click", toggleToDo);
settingsButton.addEventListener("click", toggleSettings);
addToDo.addEventListener("click", addToDoItem);
toDoList.addEventListener("click", removeToDoItem);
toDoList.addEventListener("change", lineThrough);

// add event listeners to the color buttons
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    changeColor(themes[button.id]);
  });
});

// Add the event listener to the "Hide Everything in Fullscreen" checkbox
hideCheckbox.addEventListener("change", checkFullscreen);

// Add the event listener to the "Disable Border Around Hour" checkbox
borderCheckbox.addEventListener("change", () => {
  if (borderCheckbox.checked) {
    clock.style.border = "none";
    clock.style.backgroundColor = "transparent";
    clock.style.boxShadow = "none";
  } else {
    clock.style.border = "3px solid var(--clock-border-color)";
    clock.style.backgroundColor = "var(--clock-background-color)";
    clock.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  }
});

// Add the event listener to the "Chime on the Hour" checkbox
chimeCheckbox.addEventListener("change", () => {
  if (chimeCheckbox.checked) {
    hourChime.volume = 0.7;
  } else {
    hourChime.volume = 0;
  }
});
