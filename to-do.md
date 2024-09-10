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
- [ ] Number of schedules to generate
    - [ ] 30 default, no cap (optional)
    - [ ] Time cap(optional) in minutes (int)
- [x] Generate button
- [ ] Schedules are generated and displayed below the button
- [ ] If the estimated # of results is a very large number (internally parametrized), give a warning if people want to continue with the generation or not
- [x] Add a chime when the generating finishes
    -[ ] Change chime so it doesn't give people a heart attack
- [x] change filters to be similar shape of the calendar (in order to avoid filter conflicts)
- [x] Have filter drop downs only show when certain people are available 
- [ ] have a checkbox that will prioritize people who don't have as much availability