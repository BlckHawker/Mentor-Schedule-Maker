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
### View/Edit  Mentor
- [x] Navbar
- [ ] Dropdown with all mentors
- [ ] Once clicked, schedule shows up for that mentor
- [ ] Same thing as creating a mentor shows up for that mentor
- [ ] Save button
- [ ] Reset button
### View All Mentors
- [x] Navbar
- [ ] View all mentors individually
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
    -[ ] Change chime so it doesn't give people a heart attack
- [x] change filters to be similar shape of the calendar (in order to avoid filter conflicts)
- [x] Have filter drop downs only show when certain people are available 
- [x] Have a checkbox that will force every mentor to get at least one shift (initially on)
    - [ ] If there are more than 40 mentors, show an error saying that it's not possible
- [ ] Fix the "syntax" errors
- [ ] Add threading (or make generateSchedules an async function) so a timer of how long generation is has been appears (along with how many schedules have been found)
- [x] Refactor Generate Schedules into a recursive method
- [ ] Refactor getDayShifts
    - [ ] make the nested for loops a recursive method
        - [ ] remove any day possibilities where people are working more than the max amount of shifts (make removeMaxHoursExceededDays redundant)