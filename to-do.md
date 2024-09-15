### Misc
- [x] Creation of general pages (Kovu)
### Home Page (Kovu)
- Navbar (EACH PAGE WILL HAVE THIS)
    - [x] Create mentor
    - [x] Generate Schedule
    - [x] View/Edit mentor
    - [x] View all mentor availability
- Body
    - [x] Ptag with what the website is about
    - [ ] (maybe) current mentor schedule
### Creating A Mentor (Sylvia)
- [x] Navbar
- [ ] Buttons
    - [ ] Grey if that time slot is unavailable
    - [ ] Green if available
- [ ] Text bar for name
    - [ ] Names have to be unique 
    - [ ] force people to put first and last names
- [ ] Submit button
    - [ ] Fix bug where validation says there is an empty schedule
- [x] Update debug mentors
### View/Edit Mentor
- [x] Navbar
- [ ] Have a dropdown with all mentors
    - [ ] Selecting a specific mentor, will show that mentor's availability (Have the same layout of Creating A Mentor)
        - [ ] Save button (updates said mentor's availability)
        - [ ] Reset button (will revert to the original availability of the chosen mentor)
        - [ ] Delete button to delete that specific mentor from local storage
### View All Mentors
- [x] Navbar
- [ ] View all mentors' availability
- [ ] Delete button that will clear all mentors from local storage
### Generating Schedules (Kovu)
- [x] Navbar
- [x] Max Hours allowed
- [x] Number of schedules to generate
    - [x] 30 default, no cap (optional) (implemented, but not fully tested since generation takes too long)
    - [x] Time cap(optional) in minutes (int)
- [x] Generate button
- [ ] Schedules are generated and displayed below the button
    - [ ] Have each person have their own color from a list of colors (max 120)
- [ ] If the estimated # of results is a very large number (internally parametrized) with no max time given, give a warning if people want to continue with the generation or not
- [x] Add a chime when the generating finishes
    - [ ] Change chime so it doesn't give people a heart attack
- [x] change filters to be similar shape of the calendar (in order to avoid filter conflicts)
- [x] Have filter drop downs only show when certain people are available 
- [x] Have a checkbox that will force every mentor to get at least one shift (initially on)
    - [x] If there are more than 40 mentors, show an error saying that it's not possible (assuming there is at max one mentor per shift)
- [ ] Fix the "syntax" errors
- [ ] Add threading (or make generateSchedules an async function) so a timer of how long generation is has been appears (along with how many schedules have been found)
- [x] Refactor Generate Schedules into a recursive method
- [ ] Refactor getDayShifts
    - [x] make the nested for loops a recursive method
        - [x] remove any day possibilities where people are working more than the max amount of shifts (make removeMaxHoursExceededDays redundant)