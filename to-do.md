# Project Checklist

## Display Hour

- [x] Display the current hour (not minutes)
- [x] Center hour display in page
- [x] Ensure display accurately updates when an hour passes
- [x] Add basic styling with CSS

## Hourly Chime

- [x] Implement hourly chime
- [x] Select/create audio to play every hour
- [x] Add audio to project files
- [x] Update JavaScript to play the chime every hour
- When settings are added to the project, maybe add toggle for whether the hourly chime plays?

## To-Do List

- [x] Add to-do list
- [x] Create to-do list section in HTML
- A menu which pops up on click (hidden by default)
- [x] Add JavaScript for list pop-up toggle
- [x] Write function to add to-do list item
- [x] Write function to complete to-do list item
- [x] Add CSS styling for to-do list and entries
- [x] Decide whether to store to-do entries and status locally, or reset when the page is closed
- Depending on decision, more to-do entries may be needed here

## Deadline Timer

- [ ] Add deadline timer
- Deadline timer: user sets a time to stop working, and a warning duration (e.g. 30 minutes). At (deadline - warning), a notification sound plays and the clock switches from showing just the hour to showing the full time. At deadline, an alarm goes.
- [ ] Add HTML to display deadline timer (pop-up menu on clicking an alarm button, perhaps? Defaults to hidden)
  - [ ] Add JavaScript to toggle pop-up
  - [ ] Ensure HTML includes functionality to input a deadline
  - [ ] Add CSS styling for deadline timer display
- [ ] Add JavaScript to set deadline
- [ ] Select/create alarm sound
- [ ] Add alarm sound to project files
- [ ] Add JavaScript so that at deadline, alarm sound plays
- [ ] Add HTML to set a warning window duration
- [ ] Update clock to add function to change display from hour to hour and minutes
- [ ] Add JavaScript so that at the start of the warning window, the clock changes to display hour and minutes
- [ ] Make any necessary changes to deadline timer styling in CSS
- [ ] Select/create warning sound
- [ ] Add warning sound to project files
- [ ] Add JavaScript so that when the warning time starts, the warning sound plays
- Does sound play for a set amount of time, or does the user need to click something to turn the alarm off?

## Colour Themes

- [ ] Enable customisable colour themes
- [ ] Ensure colours in CSS are set with variables rather than literals
- [ ] Design a handful of colour themes
- [ ] Add a settings pop-up to HTML
- [ ] Add JavaScript to toggle settings pop-up
- [ ] Add styling for settings pop-up
- [ ] Add list of colour themes to settings pop-up
- [ ] Add CSS styling for list of colour themes
- [ ] Add JavaScript function to update CSS variables to match selected colour theme

## Optional minute visibility

- [ ] Add minute visibility toggle to settings
- [ ] Add HTML to settings menu for toggle to view minutes instead of just hour
- [ ] Add styling for toggle
- [ ] Add JavaScript to toggle minute display
- Note: already able to add minute display from deadline timer; can reuse same functionality
- Will need to ensure the settings toggle doesn't undesirably overwrite a setting from the deadline timer
- If minutes have been turned on and the warning time begins, minutes should remain visible.
- If minutes have not been turned on and the warning time begins, minutes should become visible.

## Soundscape feature

- [ ] Add optional soundscape feature
- [ ] Discuss sounds to be added
- rain sounds? coffee shop sounds? lo-fi music?
- [ ] Find sources for selected sounds
- [ ] Add sounds to project files
- Sounds will need to be royalty-free and looping
- If music is added, most straightforward approach may be to find an online lo-fi radio with an API to include in site.
- [ ] Add soundscape button in HTML
- Clicking the soundscape button brings up a soundscape menu, in which users can select which sounds they want to hear and set relative levels for each sound
- [ ] Add JavaScript to display pop-up on click
- [ ] Add styling to pop-up
- [ ] For each sound added, add sound and a slider (default value 0) to the soundscape menu
- [ ] For each sound, add JavaScript to start playing if slider value > 0, and to update volume
- [ ] Add styling for each sound display
