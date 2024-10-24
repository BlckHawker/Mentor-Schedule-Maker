"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { Day } from "@/app/interface/Day";
import { useState, useEffect, SetStateAction } from "react";
import { FilterInterface } from "@/app/interface/Filter";
import NavBar from "./NavBar";
import { AbstractFilter } from "./AbstractFilter";
import FilterContainer from "./FilterContainer";
import ToolTip from "./ToolTip";

const GenerateSchedule = () => {
  const pauseTime = 1; //the amount of milliseconds that will pass when "setTimeout" is called. Is there just to allow generating info to update in real time
  const maxSchedulesAllowed = 1000000; //max # of generated schedules
  const maxDayPossibilities = 1000000; //max # of day possibilities generated

  //todo make it so the 'nobody works this shift' checkbox is disabled when "Allow None Schedules" is false
  //todo change the notifSound
  //todo make the style that is for the global options dymanic to reduce repeated code.
  //todo make min/max mentors per shift for filters a dropdown between 1-3 inclusively
  const notifSound = "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"; //the sound that will play when generation finishes
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; //the days a mentor is allowed to work
  const times = ["10", "11", "12", "1", "2", "3", "4", "5"]; //the times a mentor is allowed to work
  const [schedulesFound, setSchedulesFound] = useState(0);
  const [startingTime, setStartingTime] = useState(0); //the timestamp when generation started
  const [elapsedTime, setElapsedTime] = useState(0); //the # of seconds that has passed since generation has started
  const [generatingSchedules, setGeneratingSchedules] = useState(false); //if the program is currently generating schedules
  const [forceAllMentorsBoolean, setForceAllMentorsBoolean] = useState(true); //if the program should only generate schedules where all mentors saved in local storage has at least one shift
  const [allowNoneSchedules, setAllowNoneSchedules] = useState(false); //If the program will allow nobody to be on shift for a time slot
  const [maxTimeBoolean, setMaxTimeBoolean] = useState(false); //If there is a time limit on how long generation will take
  const [maxTimeString, setMaxTimeString] = useState("1"); //The time generation will take (in minutes)
  const [maxSchedulesBoolean, setMaxSchedulesBoolean] = useState(true); //If generation will stop after a certain amount of schedules has been generated
  const [maxSchedulesString, setMaxSchedulesString] = useState("30"); //The max amount of schedules that will be found until generation stops
  const [maxShiftsString, setMaxShiftsString] = useState("4"); //The max amount of shifts each mentor is allowed to work in a week
  const [minMentors, setMinMentors] = useState("1"); //the minimum amount of mentors that can be scheduled for one shift
  const [maxMentors, setMaxMentors] = useState("1"); //the maximum amount of mentors that can be scheduled for one shift
  const [isLoading, setIsLoading] = useState(false); //if the program is loading things from local storage
  const [savedMentors, setSavedMentors] = useState<MentorInterface[]>([]); //the mentors loaded from local storage
  const [savedMentorNames, setSavedMentorNames] = useState<string[]>([]); //the mentor names that are loaded from local storage
  const [possibleSchedules, setPossibleSchedules] = useState<Schedule[]>(); //the generated schedules
  const [warningText, setWarningText] = useState(""); //text that will appear that gives the user information related to their input and the generation
  const [globalMaxMentorCount, setGlobalMaxMentorCount] = useState(parseInt(maxMentors)); //the number of filter dropdowns that will appear. Based on the max # of mentors set
  const [globalMinMentorCount, setGlobalMinMentorCount] = useState(parseInt(minMentors));
  const [showFilterPopUp, setShowFilterPopUp] = useState(false);
  const [abstractFilters, setAbstractFilters] = useState<AbstractFilter[]>([]);
  const [selectedFilterDay, setSelectedFilterDay] = useState<string>(days[0]);
  const [selectedFilterTime, setSelectedFilterTime] = useState<string>(times[0]);
  const [showAbstractFilters, setShowAbstractFilters] = useState<DayAbstractFilters>({ Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true });
  const [showGlobalOptions, setShowGlobalOptions] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  //loading data from local storage
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let str = localStorage.getItem("mentors");

      if (str === "undefined" || str === null) {
        str = "[]";
      }
      const localStorageMentors = JSON.parse(str);
      setSavedMentors(localStorageMentors);
      setSavedMentorNames(Object.values(localStorageMentors).map((mentor: any) => mentor.name));
      setIsLoading(false);
    }
    fetchData();
  }, []);

  //add schedules to local storage
  useEffect(() => {
    if (possibleSchedules !== undefined && possibleSchedules?.length > 0) {
      localStorage.setItem("schedules", JSON.stringify(possibleSchedules));
    }
  }, [possibleSchedules]);

  //update timer for generating schedules
  useEffect(() => {
    if (generatingSchedules) {
      console.log("starting time", startingTime);
      let interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startingTime) / 1000)), 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [generatingSchedules]);

  //update the number of dropdowns that appear based on max # of mentors
  useEffect(() => {
    let num = parseInt(maxMentors);
    if (Number.isInteger(num) && num >= 1 && num <= 3) {
      setGlobalMaxMentorCount(num);
    }

    num = parseInt(minMentors);
    if (Number.isInteger(num) && num >= 1 && num <= 3) {
      setGlobalMinMentorCount(num);
    }
  }, [maxMentors, minMentors]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <NavBar />
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", justifyContent: "center", gap:"10px" }}>
        <div style={{ display: "flex", fontSize: "23px", justifyContent: "center", gap: "10px" }}>
          <b>Global Options</b>
          <button onClick={() => setShowGlobalOptions((b) => !b)}>{showGlobalOptions ? "Hide" : "Show"}</button>
        </div>
        {showGlobalOptions && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={forceAllMentorsBoolean} onChange={(e) => setForceAllMentorsBoolean(e.target.checked)} />
              <ToolTip mainText={"Force All Mentors"} toolText={"Only gives schedules where all mentors have at least one shift"} idName={"force-all-mentors"} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={allowNoneSchedules} onChange={(e) => setAllowNoneSchedules(e.target.checked)} />
              <ToolTip mainText={"Allow None Schedules"} toolText={"Allow schedules where no one is schedules for a shift"} idName={"allow-none-schedules"} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <ToolTip mainText={"Minimum mentors per shift"} toolText={"The minimum amount of mentors per shift (range is 1-3 inclusively)"} idName={"min-mentors-per-shift"} />
              <input type="text" value={minMentors} onChange={(e) => setMinMentors(e.target.value)} />
              <ToolTip mainText={"Maximum mentors per shift"} toolText={"The maximum amount of mentors per shift (range is 1-3 inclusively)"} idName={"max-mentors-per-shift"} />
              <input type="text" value={maxMentors} onChange={(e) => setMaxMentors(e.target.value)} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <ToolTip mainText={"Max Shifts"} toolText={"The max amount of shifts each mentor is allowed to work in a week"} idName={"max-mentors"} />
              <input type="text" value={maxShiftsString} onChange={(e) => setMaxShiftsString(e.target.value)} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={maxTimeBoolean} onChange={(e) => setMaxTimeBoolean(e.target.checked)} />
              <ToolTip mainText={"Max Time"} toolText={"(optional) The time generation will take (in minutes)"} idName={"max-time"} />
              <input type="text" value={maxTimeString} onChange={(e) => setMaxTimeString(e.target.value)} disabled={!maxTimeBoolean}></input>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={maxSchedulesBoolean} onChange={(e) => setMaxSchedulesBoolean(e.target.checked)} />

              <ToolTip
                mainText={"Max Schedules"}
                toolText={`(optional) The max amount of schedules that will be found until generation stops (max being ${numberWithCommas(maxSchedulesAllowed)})`}
                idName={"max-schedules"}
              />
              <input type="text" value={maxSchedulesString} onChange={(e) => setMaxSchedulesString(e.target.value)} disabled={!maxSchedulesBoolean}></input>
            </div>
          </div>
        )}

        <div style={{ display: "flex", fontSize: "23px", justifyContent: "center", gap: "10px" }}>
          <b>Filters</b>
          <button onClick={() => setShowFilters((b) => !b)}>{showFilters ? "Hide" : "Show"}</button>
        </div>

        {showFilters && (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px"}}>
            <button
              onClick={() => {
                setShowFilterPopUp(true);
                setSelectedFilterTime(times[0]);
                setSelectedFilterDay(days[0]);
              }}
            >
              Add Filter
            </button>
            {days.map((day) => (
              <FilterContainer
                abstractFilters={abstractFilters
                  .filter((f) => f.day == day)
                  .sort((f1, f2) => {
                    return times.indexOf(f1.time) - times.indexOf(f2.time);
                  })}
                mentors={savedMentors}
                day={day}
                globalMinShifts={globalMinMentorCount}
                globalMaxShift={globalMaxMentorCount}
                setAbstractFilters={setAbstractFilters}
                showAbstractFilters={showAbstractFilters}
                setShowAbstractFilters={setShowAbstractFilters}
              />
            ))}
            <button disabled={generatingSchedules} onClick={() => generateSchedules()}>
              Generate schedules
            </button>
            {generatingSchedules && (
              <div>
                <p>Generating Schedules...{formatTime(elapsedTime)}</p>
                <p>Found {numberWithCommas(schedulesFound)} schedules</p>
              </div>
            )}
            {
              /* Pop up for filters */
              showFilterPopUp && (
                <div
                  style={{
                    position: "fixed",
                    zIndex: "1",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    display: showFilterPopUp ? "show" : "none",
                  }}
                >
                  <div style={{ backgroundColor: "white", margin: "10% auto", padding: "20px", width: "45%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2>Select which day and time the filter should be for</h2>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <select onChange={(e) => setSelectedFilterDay(e.target.value)}>
                        <b>Selected Day</b>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <select onChange={(e) => setSelectedFilterTime(e.target.value)}>
                        {times.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    {foundAbstractFilter() && <p style={{ color: "red" }}>A filter of that day and time already exists</p>}
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={() => setShowFilterPopUp(false)}>Close</button>
                      <button onClick={() => addFilter()} disabled={foundAbstractFilter()}>
                        Add Filter
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        )}
      </div>
      <p>{warningText}</p>
    </div>
  );

  function foundAbstractFilter() {
    return abstractFilters.find((f) => f.day == selectedFilterDay && f.time == selectedFilterTime) != undefined;
  }

  function addFilter() {
    setShowFilterPopUp(false);
    const newArr = [...abstractFilters, { day: selectedFilterDay, time: selectedFilterTime }];
    setAbstractFilters(newArr);
  }

  /**
   * generates a collection of schedules based on user
   * parameters and mentors saved in local storage
   */
  async function generateSchedules() {
    //todo: have a check for each filter to verify the min mentor count is less than the max mentor count

    setWarningText("");
    if (savedMentors.length === 0) {
      setWarningText("No mentors saved in local storage");
      return;
    }

    const maxShiftsNumber = parseInt(maxShiftsString);

    if (Number.isNaN(maxShiftsNumber) || maxShiftsNumber < 1) {
      setWarningText('"Max Shift" needs to be a number greater than 0');
      return;
    }
    const maxTimeNumber = parseInt(maxTimeString);
    if (Number.isNaN(maxShiftsNumber) || maxShiftsNumber < 1) {
      setWarningText('"Max Shift" needs to be a number greater than 0');
      return;
    }

    const maxSchedulesNumber = parseInt(maxSchedulesString);
    if (Number.isNaN(maxSchedulesNumber) || maxSchedulesNumber < 1) {
      setWarningText('"Max Schedules" needs to be a number greater than 0');
      return;
    }

    const minMentorsNumber = parseInt(minMentors);
    if (Number.isNaN(minMentorsNumber) || minMentorsNumber < 1 || minMentorsNumber > 3) {
      setWarningText('"Min Mentors per shift" needs to be a number greater than 0 and less than 4');
      return;
    }

    const maxMentorsNumber = parseInt(maxMentors);
    if (Number.isNaN(maxMentorsNumber) || maxMentorsNumber < 1 || maxMentorsNumber > 3) {
      setWarningText('"Max Mentors per shift" needs to be a number greater than 0 and less than 4');
      return;
    }

    if (minMentorsNumber > maxMentorsNumber) {
      setWarningText('"Min Mentors per shift" needs to be a number less than "Max Mentors per shift"');
      return;
    }

    //set the starting time and start generation
    const startTime = new Date().getTime();
    setStartingTime(startTime);
    setElapsedTime(0);
    setGeneratingSchedules(true);
    setSchedulesFound(0);
    await new Promise((r) => setTimeout(r, pauseTime));

    //get the filters
    let filters: FilterInterface[] = [];
    let filtersError = false;
    for (const selectedDay of days) {
      if (filtersError) {
        break;
      }
      for (const selectedTime of times) {
        const shiftFilters = [] as FilterInterface[];
        const filterElements = Array.from(document.querySelectorAll(`.${selectedDay}-${selectedTime}`)) as unknown as HTMLInputElement[];
        const selectedMentors = filterElements.map((select) => select.value);
        for (const selectedMentor of selectedMentors)
          if (selectedMentor === "None") {
            shiftFilters.push({ selectedMentor, selectedDay, selectedTime });
          } else if (selectedMentor !== "Any" && shiftFilters.every((filter) => filter.selectedMentor !== selectedMentor)) {
            shiftFilters.push({ selectedMentor, selectedDay, selectedTime });
          }

        //if the number of shiftFilters is greater than "minMentorsNumber", set a warning
        if (shiftFilters.filter((f) => f.selectedMentor !== "None").length > minMentorsNumber) {
          setWarningText(`The amount of filtered mentors on ${selectedDay} at ${selectedTime} (${shiftFilters.length}) is greater than "Mentors per shift" (${minMentorsNumber})`);
          filtersError = true;
          break;
        }

        filters = filters.concat(shiftFilters);
      }
    }

    if (filtersError) {
      setGeneratingSchedules(false);
      return;
    }

    //if there's a shift where all filters are "None", but "Allow None Schedules" is false, set a warnings
    //todo make getting relevant filters a method as this is used somewhere else
    for (const day of days) {
      for (const time of times) {
        const relevantFilters = getRelevantFilters(filters, day, time);
        if (relevantFilters.every((f) => f.selectedMentor === "None") && !allowNoneSchedules) {
          setGeneratingSchedules(false);
          setWarningText(`Can't generate schedules for ${day} at ${time} as filtered Mentors are are all set to "None". But "Allow None Schedules" is set to false`);
          return;
        }
      }
    }

    console.log(filters);

    //get all of the possible shift (one mentor) for each block
    const allDayPossibilities: { [key: string]: Day[] } = {};

    //todo: if any of "getAllDayPossibilities" return an empty arr, immediately stop generation
    for (const day of days) {
      await new Promise((r) => setTimeout(r, pauseTime));
      allDayPossibilities[day] = getAllDayPossibilities(day, filters, maxShiftsNumber, minMentorsNumber, maxMentorsNumber);

      console.log(allDayPossibilities[day]);
    }

    //the length of all possibilities multiplied together
    const expectedResultNumber = Object.values(allDayPossibilities).reduce((preVal, possibilities) => preVal * possibilities.length, 1);
    console.log(`Estimated number of results is ${expectedResultNumber}`);
    const schedules = [] as any[];

    /**
     * Recursively generates a schedule
     * @param {number} dayIndex the index of the day that is currently being generated. Ex: 0 is Monday
     * @param {Schedule} currentSchedule the schedule object that is being generated
     * @param {string[]} scheduleNameList the name of the mentors that are working (has duplicates to show the same mentor on multiple shifts)
     * @return {Promise<void|Schedule>} nothing. Return type is for going deeper in recursion. The return value should never be used
     */
    async function generateSchedulesRecursion(dayIndex: number, currentSchedule: Schedule, scheduleNameList: string[]): Promise<void | Schedule> {
      //force to wait on Monday, Wednesday and Friday
      if (dayIndex % 2 == 0) {
        await new Promise((r) => setTimeout(r, pauseTime));
      }

      //base case: Friday has been processed
      if (dayIndex >= days.length) {
        if (forceAllMentorsBoolean) {
          const peopleCount = savedMentorNames.map((name) => itemCounter(scheduleNameList, name));
          if (peopleCount.every((num) => num > 0)) {
            schedules.push(currentSchedule);
          }
        } else {
          schedules.push(currentSchedule);
        }

        setSchedulesFound(schedules.length);
        return currentSchedule;
      }

      const day = days[dayIndex];
      //verify that the alloted time nor the max amount of schedules generated has not exceeded
      for (const shift of allDayPossibilities[day]) {
        if (maxTimeExceeded(maxTimeNumber, startTime) || maxSchedulesExceeded(maxSchedulesNumber, schedules.length) || schedules.length >= maxSchedulesAllowed) {
          break;
        }

        const shiftNames = Object.values(shift).flatMap((arr) => arr) as string[];
        const newScheduleNameList = scheduleNameList.concat(shiftNames);

        const newSchedule = { ...currentSchedule, [day]: shift };
        //verify that nobody has worked more than the max amount of hours
        if (exceedHourLimit(newScheduleNameList, maxShiftsNumber)) {
          continue;
        }

        await generateSchedulesRecursion(dayIndex + 1, newSchedule, newScheduleNameList);
      }
    }

    //recursively generate all the schedules
    await generateSchedulesRecursion(0, {} as Schedule, []);

    const elapsedSeconds = getElapsedSeconds(startTime);

    setWarningText(`Found ${numberWithCommas(schedules.length)} schedule(s) in ${formatTime(elapsedSeconds)}`);
    setPossibleSchedules(schedules);

    //play sound to notify user that generation is done
    new Audio(notifSound).play();
    setGeneratingSchedules(false);
  }

  /**
   * Gets all the filters for a specific day and time
   * @param {FilterInterface[]} allFilters all of the filters
   * @param {string} day the desired day of the filters
   * @param {string} time the desired time of the filters
   * @return {FilterInterface[]} the filters that match the given day and time
   */
  function getRelevantFilters(allFilters: FilterInterface[], day: string, time: string): FilterInterface[] {
    return allFilters.filter((f) => f.selectedDay === day && f.selectedTime === time);
  }

  /**
   * formats a number so it's separated by commas
   * @param {number} number the number that will be formatted
   * @return {string} the formatted number
   */

  function numberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Formats the number of seconds that has passed
   * into days, hours, minutes, and seconds
   * @param {number} elapsedSeconds the number of seconds that has elapsed
   * @return {string} the formatted time
   */

  function formatTime(elapsedSeconds: number): string {
    const days = Math.floor(elapsedSeconds / 86400);
    elapsedSeconds = elapsedSeconds % 86400;
    const hours = Math.floor(elapsedSeconds / 3600);
    elapsedSeconds = elapsedSeconds % 3600;
    const minutes = Math.floor(elapsedSeconds / 60);
    elapsedSeconds = elapsedSeconds % 60;

    let str = "";
    if (days > 0) {
      str += `${days}d`;
    }

    if (days > 0 || hours > 0) {
      str += ` ${hours}h`;
    }

    if (days > 0 || hours > 0 || minutes > 0) {
      str += ` ${minutes}m`;
    }

    str += ` ${elapsedSeconds}s`;

    return str.trim();
  }

  /**
   * get all the people who can work a specific shift on a specific day and time
   * @param {string} specifiedDay the day in question
   * @param {number} index the idex of the time in question. 0 would be the 10am shift
   * @return {string[]} all of the people who can work on that shift (with the addition of a "None" element)
   */
  function getAllTimeShifts(specifiedDay: string, index: number): string[] {
    if (savedMentors === undefined) {
      setWarningText(`There was an error getting all the people who can work on ${specifiedDay} at ${times[0]}`);
      return [];
    }

    const names = [] as string[];

    savedMentors.forEach((m) => {
      Object.keys(m.availability).forEach((day) => {
        if (day == specifiedDay && m.availability[day as keyof MentorInterface["availability"]][index]) {
          names.push(m.name);
        }
      });
    });

    //in case nobody can work that shift
    names.push("None");

    return names;
  }

  /**
   * Tells how many times a specific item has occurred in an array
   * @param {string[]} arr the array of items
   * @param {string} item the item that will be counted
   * @return {number} the amount of times the item was found
   */
  function itemCounter(arr: string[], item: string): number {
    return arr.filter((x) => x === item).length;
  }

  /**
   * @param {string[]} people the collection of names of mentors who are working
   * @param {number} maxShiftsNumber the max amount of hours each mentor is allowed to work
   * @return {boolean} if there is a mentor who is working more than the max amount of hours
   */
  function exceedHourLimit(people: string[], maxShiftsNumber: number): boolean {
    const peopleAgg: { [person: string]: number } = {};
    for (const person of people) {
      if (!(person in peopleAgg)) {
        peopleAgg[person] = 0;
      }
      peopleAgg[person]++;
      if (peopleAgg[person] > maxShiftsNumber) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get a dropdown element of all the mentors working a specific day and time
   * @param {string} className the class of the element that tells the day/time of the shift. Ex: Monday-10
   * @return {JSX.Element} a select dropdown element where all the options are the relevant mentor names
   */
  function getDropDown(className: string): JSX.Element {
    if (isLoading || savedMentors === undefined) {
      <select></select>;
    }
    const day = className.split("-")[0];
    const time = className.split("-")[1];
    const timeIndex = times.indexOf(time);
    const validMentors = savedMentors.filter((mentor) => mentor.availability[day as keyof MentorInterface["availability"]][timeIndex]);
    //add the ability to select "None"
    const names = ["Any", "None"].concat(validMentors.map((mentor) => mentor.name));
    const selectOption = (
      <select className={className}>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    );
    //todo: change this to be dynamic
    switch (globalMaxMentorCount) {
      case 1:
        return <div>{selectOption}</div>;

      case 2:
        return (
          <div>
            {selectOption}
            {selectOption}
          </div>
        );

      default: //3
        return (
          <div>
            {selectOption}
            {selectOption}
            {selectOption}
          </div>
        );
    }
  }

  /**
   * Get the amount of time that has passed in seconds given the start time
   * @param {number} startTime the timestamp of the starting time
   * @return {number} the amount of time that has passed in seconds
   */
  function getElapsedSeconds(startTime: number): number {
    return Math.floor((new Date().getTime() - startTime) / 1000);
  }

  /**
   * Get the amount of time that has passed in minutes given the start time
   * @param {number} startTime the timestamp of the starting time
   * @return {number} the amount of time that has passed in minutes
   */
  function getElapsedMinutes(startTime: number): number {
    const elapsedSeconds = getElapsedSeconds(startTime);
    return Math.floor((elapsedSeconds % 3600) / 60);
  }

  /**
   * Tells if the elapsed amount of time has passed a threshold (in minutes)
   * @param {number} maxTimeNumber the threshold time (in minutes)
   * @param {number} startTime the timestamp of the starting time
   * @return {boolean} if "maxTimeBoolean" is true and the amount of time has exceeded
   */
  function maxTimeExceeded(maxTimeNumber: number, startTime: number): boolean {
    const minutes = getElapsedMinutes(startTime);
    return maxTimeBoolean && minutes >= maxTimeNumber;
  }

  /**
   * Tells if the amount of generated schedules has reached or passed the threshold
   * @param {number} maxScheduleNumber the threshold amount of schedules
   * @param {number} scheduleCount the current amount of schedules
   * @return {boolean} if "maxSchedulesBoolean" and scheduleCount is greater or equal to maxScheduleNumber
   */
  function maxSchedulesExceeded(maxScheduleNumber: number, scheduleCount: number): boolean {
    return maxSchedulesBoolean && scheduleCount >= maxScheduleNumber;
  }

  /**
   * Get all of the possible Day generations for a specific day
   * @param {string} day the name of the day of possibilities that are being generated
   * @param {FilterInterface} filters the relevant filters that are related to the day that is being generated
   * @param {string} maxShift the max amount of shifts each mentor is allowed to work in a week
   * @param {string} minMentorPerShift the minimum amount of mentors that are schedule for a shift
   * @param {string} maxMentorPerShift the maximum amount of mentors that are schedule for a shift
   * @return {Day[]} all of the possible configurations of the day (max count is "maxDayPossibilities". Look at top of the file)
   */
  function getAllDayPossibilities(day: string, filters: FilterInterface[], maxShift: number, minMentorPerShift: number, maxMentorPerShift: number): Day[] {
    interface DayInfo {
      day: Day;
      maxMentorCount: number;
      nameList: string[];
    }
    const allDayPossibilities: DayInfo[] = []; //all possibilities of the parameter "day"
    const shiftPossibilities: { [key: string]: string[][] } = {}; //all possibilities of a specific time of the "day" parameter

    for (let i = 0; i < times.length; i++) {
      const relevantFilters = getRelevantFilters(filters, day, times[i]);
      const nonNoneFilters = relevantFilters.filter((f) => f.selectedMentor !== "None"); //filters where "None" is not an option
      const noneFilterCount = relevantFilters.length - nonNoneFilters.length; //the number of filters where "None is the options"
      let targetedFilters = [] as FilterInterface[]; //the filters that will be used while generating day possibilities

      //calculate the new minMentorPerShift and maxMentorPerShift based on the filters
      const newMaxMentorPerShift = maxMentorPerShift === noneFilterCount ? 1 : maxMentorPerShift - noneFilterCount;

      let newMinMentorPerShift;
      let allNoneFilters = false;

      //there are no relevant filters
      if (relevantFilters.length === 0) {
        targetedFilters = [];
        newMinMentorPerShift = minMentorPerShift;
      }
      //all the filters are "None" and the "None" count is maxMentorPerShift
      else if (noneFilterCount === maxMentorPerShift) {
        allNoneFilters = true;
        newMinMentorPerShift = 1;
      }

      //all the filters are "None"
      else if (relevantFilters.length === noneFilterCount) {
        newMinMentorPerShift = minMentorPerShift;
      } else {
        newMinMentorPerShift = nonNoneFilters.length;
        targetedFilters = [];
      }

      if (allNoneFilters && noneFilterCount > 0) {
        targetedFilters.push({ selectedDay: day, selectedTime: times[i], selectedMentor: "None" });
      }

      targetedFilters = targetedFilters.concat(nonNoneFilters);
      shiftPossibilities[times[i]] = getTotalCombination(day, i, targetedFilters, newMinMentorPerShift, newMaxMentorPerShift);
    }

    function generateDayPossibility(timeIndex: number, currentDaySchedule: Day) {
      if (timeIndex >= times.length) {
        const names = Object.values(currentDaySchedule).flatMap((arr) => arr) as string[];
        if (!exceedHourLimit(names, maxShift)) {
          const dayObj = {} as DayInfo;
          dayObj.day = currentDaySchedule;
          dayObj.nameList = names;
          dayObj.maxMentorCount = getMaxNameCount(dayObj);
          allDayPossibilities.push(dayObj);
        }
        return currentDaySchedule;
      }

      const time = times[timeIndex];
      for (const shift of shiftPossibilities[time]) {
        if (allDayPossibilities.length >= maxDayPossibilities) {
          break;
        }
        const newSchedule = { ...currentDaySchedule, [time]: shift };
        generateDayPossibility(timeIndex + 1, newSchedule);
      }
    }

    generateDayPossibility(0, {} as Day);

    function onlyUnique(value: string, index: number, array: string[]) {
      return array.indexOf(value) === index;
    }

    function getMaxNameCount(day: DayInfo) {
      //don't include "None" in the max count
      const nameList = day.nameList.filter((name) => name !== "None");
      const distinctNames = nameList.filter(onlyUnique);
      const nameCount = distinctNames.map((name) => itemCounter(nameList, name));
      return Math.max(...nameCount);
    }

    //sort the possibilities by the least peak "mentor count"
    const sortedPossibilities = allDayPossibilities.sort((a, b) => a.maxMentorCount - b.maxMentorCount);
    const noneArr = [];
    const notNoneArr = [];

    //prioritize day possibilities where "None" is not present
    for (const possibility of sortedPossibilities) {
      if (possibility.nameList.includes("None")) {
        noneArr.push(possibility.day);
      } else {
        notNoneArr.push(possibility.day);
      }
    }

    return notNoneArr.concat(noneArr);
  }

  /**
   * Get all of the possible combinations of mentors who can work a specific day and time
   * @param {string} day the name of the day of the shift that is be generated
   * @param {number} index the index of the time of the shift that is be generated. Ex: 0 is the 10am shift
   * @param {FilterInterface[]} filters the relevant filters of that specific day and time
   * @param {number} min the minimum amount of mentors that is allowed per shift
   * @param {number} max the maximum amount of mentors that is allowed per shift
   * @return {string[][]} all of the possible combinations of shifts
   */
  function getTotalCombination(day: string, index: number, filters: FilterInterface[], min: number, max: number): string[][] {
    //get a list of the mentors
    const mentors = getAllTimeShifts(day, index);
    const results: string[][] = [];

    const filteredNames = filters.map((filter) => filter.selectedMentor);

    //get combinations from lengths [max, min] inclusively
    for (let i = min; i <= max; i++) {
      const r = getCombinations(mentors, i);

      for (const arr of r) {
        if (filteredNames.every((requiredName) => arr.includes(requiredName))) {
          results.push(arr);
        }
      }
    }

    const filteredResults = [] as string[][];
    for (const result of results) {
      //only allow ["None"] if "allowNoneSchedules" is true
      if (allowNoneSchedules && result.length == 1) {
        filteredResults.push(result);
        continue;
      }

      //remove results that have "None" as a mentor if they have a length more than 1
      if (!result.includes("None")) {
        filteredResults.push(result);
      }
    }

    return filteredResults;
  }

  /**
   * Get all of the combinations given a collection
   * @param {string[]} array the collection of items
   * @param {number} length the number of items that will be chosen
   * @return {string[][]} All of the combinations
   */
  function getCombinations(array: string[], length: number): string[][] {
    const result: string[][] = [];

    const generate = (current: string[], start: number) => {
      if (current.length === length) {
        result.push([...current]);
        return;
      }

      for (let i = start; i < array.length; i++) {
        current.push(array[i]); // Include the current element
        generate(current, i + 1); // Move to the next element
        current.pop(); // Backtrack to try the next combination
      }
    };

    generate([], 0);

    return result;
  }
};

export default GenerateSchedule;
