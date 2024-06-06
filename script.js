// create a variable that accesses the div where the hour will be displayed
const hourDisplay = document.querySelector('.hour');

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

  // wait for one second, then run this code again
  setTimeout(updateTime, 1000);
}

function setHourDisplay(timeDisplay) {
  // set hourDisplay content to timeDisplay
  hourDisplay.textContent = timeDisplay;
}

updateTime();