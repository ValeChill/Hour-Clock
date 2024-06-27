// import colors
import { themes, icons } from "../config/config.js";

// create a variable that accesses the div where the hour will be displayed
const hourDisplay = document.querySelector(".hour");
const clock = document.querySelector(".clock");
let currentHour = new Date().getHours();

// create variable for sounds
const hourChime = document.querySelector("#hour-chime");
const deadlineAlarm = document.querySelector("#deadline-alarm");
const warningSound = document.querySelector("#warning-sound");
const pomodoroStart = document.querySelector("#pomodoro-start");
const pomodoroEnd = document.querySelector('#pomodoro-end');

// to-do list variables
const toDoList = document.querySelector("#to-do-list");
const toDo = document.querySelector("#to-do");
const toDoForm = document.querySelector("#to-do-form");
// all section containers and buttons
const sectionContainers = document.querySelectorAll(".section-container");
const sectionButtons = document.querySelectorAll(".section-button");

// list of to-do items and status
let toDoEntries = [];

// settings variables
const colorButtons = document.querySelectorAll(".color-button");
const hideCheckbox = document.querySelector("#hide-everything");
const borderCheckbox = document.querySelector("#border-toggle");
const chimeCheckbox = document.querySelector("#chime-toggle");
const minutesCheckbox = document.querySelector("#show-minutes");

// deadline variables
const deadlineForm = document.querySelector("#deadline-form");
const deadlineTime = document.querySelector("#deadline");
const deadlineWarning = document.querySelector("#warning-time");
const alarmOffBtn = document.querySelector(".stop-alarm-button");
let deadline = null;
let warning = null;

// music player variables
const musicPlayer = document.querySelector(".music-controls");

// pomodoro variables
const pomodoroForm = document.querySelector('#pomodoro-form');
const pomodoroDuration = document.querySelector('#pomodoro-duration');
const pomodoroBreakDuration = document.querySelector('#break-duration');
let workTime = null;
let breakTime = null;
let workDeadline = null;
let breakDeadline = null;
let borderEnd = 0;
let borderInc = 0;

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

// get full time string
function getMinuteString(time) {
  let h = time.getHours();
  let m = time.getMinutes();
  let midday = "am";
  if (h >= 12) {
    h = h === 12 ? h : h - 12;
    midday = "pm";
  } else if (h === 0) {
    h = 12;
  }

  // add leading zero to minutes if they are less than 10
  m = m < 10 ? "0" + m : m;

  return `${h}:${m}${midday}`;
}

function triggerTimeEvent(cTime, tTime, sound, type = "") {
  // cTime = current time; tTime = trigger time
  let tH = tTime.getHours();
  let tM = tTime.getMinutes();
  let tS = tTime.getSeconds();
  let cH = cTime.getHours();
  let cM = cTime.getMinutes();
  let cS = cTime.getSeconds();

  if (tH === cH && tM === cM && tS === cS) {
    sound.play();
    if (type == "warning") {
      minutesCheckbox.checked = true;
      warning = null;
    } else if (type === "deadline") {
      alarmOffBtn.classList.remove("hidden");
      deadlineForm.lastElementChild.value = "Add";
      deadline = null;
    } else if (type === "pomodoro-end") {
      // end of work time; calculate break time end
      breakDeadline = new Date(Date.now() + breakTime);
      workDeadline = null;
      borderInc = -1 * (360 / (breakTime / 1000));
    } else if (type === "pomodoro-start") {
      breakDeadline = null;
      workDeadline = new Date(Date.now() + workTime);
      borderInc = 360 / (workTime / 1000);
    }
  }
}

function updateTime() {
  // store the current time in a variable
  const time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let timeDisplay;

  if (borderEnd + borderInc > 360 && borderEnd < 360) {
    borderEnd = 360;
  } else if (borderEnd + borderInc > 360 || (borderEnd + borderInc < 0)) {
    borderEnd = 0;
  } else {
    borderEnd += borderInc;
  }

  setPomodoroBorder(`${borderEnd}deg`);

  if (warning) {
    triggerTimeEvent(time, warning, warningSound, "warning");
  }

  if (deadline) {
    triggerTimeEvent(time, deadline, deadlineAlarm, "deadline");
  }

  if (workDeadline) {
    triggerTimeEvent(time, workDeadline, pomodoroEnd, "pomodoro-end");
  }

  if (breakDeadline) {
    triggerTimeEvent(time, breakDeadline, pomodoroStart, "pomodoro-start");
  }

  if (minutesCheckbox.checked) {
    timeDisplay = getMinuteString(time);
  } else {
    timeDisplay = getHourString(time);
  }

  // run hour-change events if hour has changed since last time code ran
  currentHour != h ? onNewHour(timeDisplay) : null;
  hourDisplay.textContent = timeDisplay;

  // rather than have 2 separate functions calling setTimeout,
  // move checkFulLScreen refresh here
  checkFullscreen();

  // wait for one second, then run this code again
  setTimeout(updateTime, 1000);
}

function onNewHour(timeDisplay) {
  setHourDisplay(timeDisplay);
  currentHour = new Date().getHours();
  hourChime.play();
}

function setHourDisplay(timeDisplay) {
  // set hourDisplay content to timeDisplay
  hourDisplay.textContent = timeDisplay;
}

// section visibility toggle
function toggleSection(e) {
  let btn = e.target;
  if (!btn.classList.contains("section-button")) {
    btn = btn.parentElement;
  }
  let section = btn.nextElementSibling;

  section.classList.toggle("hidden");

  if (!section.classList.contains("hidden")) {
    sectionContainers.forEach((s) => {
      if (s != section) {
        s.classList.add("hidden");
      }
    });
  }
}

// add to-do item to the list
function addToDoItem(event) {
  event.preventDefault();
  const toDoItem = toDo.value;
  if (toDoItem) {
    displayNewToDo(toDoItem);
    toDoEntries.push({ item: toDoItem, value: false });
    toDo.value = "";
    saveToDoList();
  }
}

function displayNewToDo(text, complete = false) {
  const listDiv = document.createElement("div");
  const deleteButton = document.createElement("button");
  const checkbox = document.createElement("input");
  const li = document.createElement("li");

  listDiv.classList.add("list-item");
  deleteButton.textContent = "✖️";
  deleteButton.classList.add("delete-button");
  checkbox.type = "checkbox";

  if (complete == true) {
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
    let toDoText = e.target.parentElement.querySelector("li").textContent;
    let entry = toDoEntries.findIndex((entry) => entry["item"] === toDoText);
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
  let toDoText = e.target.parentElement.querySelector("li").textContent;
  let entry = toDoEntries.findIndex((entry) => entry["item"] === toDoText);
  if (e.target.checked) {
    e.target.nextElementSibling.style.textDecoration = "line-through";
    e.target.nextElementSibling.style.color = "gray";
    toDoEntries[entry]["value"] = true;
  } else {
    e.target.nextElementSibling.style.textDecoration = "none";
    e.target.nextElementSibling.style.color = "black";
    toDoEntries[entry]["value"] = false;
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
      displayNewToDo(item["item"], item["value"]);
    });
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

// set icons for the icons in the settings section
function setIcons() {
  Object.keys(icons).forEach((iconKey) => {
    const element = document.querySelector(`#${iconKey}`);
    if (element) {
      element.setAttribute("name", icons[iconKey]);
    }
  });
}

// check if the window is in fullscreen mode and hide elements if it is
function checkFullscreen() {
  if (hideCheckbox.checked) {
    if (!window.screenTop && !window.screenY) {
      sectionContainers.forEach((section) => {
        section.classList.add("hidden");
      });
      sectionButtons.forEach((button) => {
        button.classList.add("hidden");
      });
      musicPlayer.classList.add("hidden");
      clock.style.border = "none";
      clock.style.backgroundColor = "transparent";
      clock.style.boxShadow = "none";
    } else {
      sectionButtons.forEach((button) => {
        button.classList.remove("hidden");
      });
      musicPlayer.classList.remove("hidden");
      clock.style.border = "3px solid var(--clock-border-color)";
      clock.style.backgroundColor = "var(--clock-background-color)";
      clock.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    }
  }
}

function setDeadline(e) {
  e.preventDefault();
  if (e.submitter.id == "add-deadline") {
    // get values
    const deadlineInput = deadlineTime.value;
    const warningInput = deadlineWarning.value;

    let deadlineHour, deadlineMinute;
    [deadlineHour, deadlineMinute] = deadlineInput.split(":");

    deadline = new Date(0, 0, 0, deadlineHour, deadlineMinute);
    warning = new Date(deadline - warningInput * 60000);

    e.submitter.value = "Update";
    e.submitter.nextElementSibling.classList.remove("hidden");
  } else if (e.submitter.id == "clear-deadline") {
    deadline = null;
    warning = null;
    e.submitter.classList.add("hidden");
    e.submitter.previousElementSibling.value = "Set Deadline";
  }
  let section = e.target.parentElement;
  section.classList.add("hidden");
}

function setPomodoro(e) {
  e.preventDefault();
  if (e.submitter.id == "set-pomodoro") {
    // get values
    const durationInput = pomodoroDuration.value;
    const breakInput = pomodoroBreakDuration.value;

    workTime = durationInput * 60000 // duration in ms
    breakTime = breakInput * 60000 // duration in ms

    borderInc = 360 / (workTime / 1000);

    workDeadline = new Date(Date.now() + workTime);

    e.submitter.value = "Reset";
    e.submitter.nextElementSibling.classList.remove("hidden");
    pomodoroStart.play();
  } else if (e.submitter.id == "clear-pomodoro") {
    workTime = null;
    breakTime = null;
    workDeadline = null;
    breakDeadline = null;
    borderInc = 0;
    borderEnd = 0;
    setPomodoroBorder(`${borderEnd}deg`);

    e.submitter.previousSibling.value = "Add";
    e.submitter.classList.add("hidden");
    pomodoroEnd.play();
  }
  let section = e.target.parentElement;
  section.classList.add("hidden");
}

function setPomodoroBorder(endAngle) {
  clock.style.setProperty('--border-end', endAngle);
}

// set the time and run the updateTime function when the page loads
setHourDisplay(getHourString(new Date()));
updateTime();
// default hourChime volume
hourChime.volume = 0.7;

// run the changeColor function when the page loads so default colors are set
changeColor();

// run the setIcons function when the page loads so default icons are set
setIcons();

// run the loadToDoList function when the page loads
loadToDoList();

// add event listeners to section containers
sectionButtons.forEach((button) => {
  button.addEventListener("click", toggleSection);
});

// add event listeners to to-do buttons
toDoForm.addEventListener("submit", addToDoItem);
toDoList.addEventListener("click", removeToDoItem);
toDoList.addEventListener("change", lineThrough);
deadlineForm.addEventListener("submit", setDeadline);
pomodoroForm.addEventListener("submit", setPomodoro);

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
    hourChime.volume = 0;
  } else {
    hourChime.volume = 0.7;
  }
});

alarmOffBtn.addEventListener("click", () => {
  deadlineAlarm.pause();
  deadlineAlarm.currentTime = 0;
  alarmOffBtn.classList.add("hidden");
});

document.addEventListener("click", function (event) {
  if (event.target === document.body) {
    sectionContainers.forEach((container) => {
      container.classList.add("hidden");
    });
  }
});
