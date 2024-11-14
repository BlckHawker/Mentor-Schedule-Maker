"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { Day } from "@/app/interface/Day";
import { useState, useEffect } from "react";
import { FilterInterface } from "@/app/interface/Filter";
import NavBar from "./NavBar";
import { AbstractShiftFilter } from "../app/interface/AbstractFilter";
import FilterContainer from "./FilterContainer";
import ToolTip from "./ToolTip";
import { DayFilterInterface } from "@/app/interface/DayFilter";
import { register } from "module";

const GenerateSchedule = () => {
  const pauseTime = 1; //the amount of milliseconds that will pass when "setTimeout" is called. Is there just to allow generating info to update in real time
  const maxSchedulesAllowed = 1000000; //max # of generated schedules
  const maxDayPossibilities = 1000000; //max # of day possibilities generated

  //todo make it so the 'nobody works this shift' checkbox is disabled when "Allow None Schedules" is false
  //todo change the notifSound
  //todo make the style that is for the global options dynamic to reduce repeated code.
  //todo make min/max mentors per shift for filters a dropdown between 1-3 inclusively
  //todo add tool tips to filters
  //todo center warning text
  //todo change warning text color to red/black depending om if it's a warning or not
  //todo change name of warning text state
  //todo make filters withing text a grid of 3 in row
  //todo make a min/max mentors per day.
  //todo have filters/options be saved in local storage and loaded on page start up
  //todo have a button that resets local storage filters/options
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
  const [minMentors, setMinMentors] = useState(1); //the minimum amount of mentors that can be scheduled for one shift
  const [maxMentors, setMaxMentors] = useState(1); //the maximum amount of mentors that can be scheduled for one shift
  const [isLoading, setIsLoading] = useState(false); //if the program is loading things from local storage
  const [savedMentors, setSavedMentors] = useState<MentorInterface[]>([]); //the mentors loaded from local storage
  const [savedMentorNames, setSavedMentorNames] = useState<string[]>([]); //the mentor names that are loaded from local storage
  const [possibleSchedules, setPossibleSchedules] = useState<Schedule[]>(); //the generated schedules
  const [warningText, setWarningText] = useState(""); //text that will appear that gives the user information related to their input and the generation
  const [showShiftFilterPopUp, setShowShiftFilterPopUp] = useState(false);
  const [showDayFilterPopUp, setShowDayFilterPopUp] = useState(false);
  const [abstractShiftFilters, setAbstractShiftFilters] = useState<AbstractShiftFilter[]>([]);
  const [abstractDayFilters, setAbstractDayFilters] = useState<string[]>([])
  const [selectedShiftFilterDay, setSelectedShiftFilterDay] = useState<string>(days[0]);
  const [selectedShiftFilterTime, setSelectedShiftFilterTime] = useState<string>(times[0]);
  const [selectedDayFilterDay, setSelectedDayFilterDay] = useState<string>(days[0]);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <NavBar boldedWord={"Generate Schedules"} />
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
        <div style={{ display: "flex", fontSize: "23px", justifyContent: "center", gap: "10px" }}>
          <b>Global Options</b>
          <button onClick={() => setShowGlobalOptions((b) => !b)}>{showGlobalOptions ? "Hide" : "Show"}</button>
        </div>
        {showGlobalOptions && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={forceAllMentorsBoolean} onChange={(e) => setForceAllMentorsBoolean(e.target.checked)} />
              <ToolTip mainText={"Force All Mentors"} toolText={"Only gives schedules where all mentors have at least one shift"} idName={"force-all-mentors"} textBold={false} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={allowNoneSchedules} onChange={(e) => setAllowNoneSchedules(e.target.checked)} />
              <ToolTip mainText={"Allow None Schedules"} toolText={"Allow schedules where no one is schedules for a shift"} idName={"allow-none-schedules"} textBold={false} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <ToolTip mainText={"Minimum mentors per shift"} toolText={"The minimum amount of mentors per shift"} idName={"min-mentors-per-shift"} textBold={false} />
              {getMentorCountDropDown(setMinMentors)}
              <ToolTip mainText={"Maximum mentors per shift"} toolText={"The maximum amount of mentors per shift"} idName={"max-mentors-per-shift"} textBold={false} />
              {getMentorCountDropDown(setMaxMentors)}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <ToolTip mainText={"Max Shifts"} toolText={"The max amount of shifts each mentor is allowed to work in a week"} idName={"max-mentors"} textBold={false} />
              <input type="text" value={maxShiftsString} onChange={(e) => setMaxShiftsString(e.target.value)} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={maxTimeBoolean} onChange={(e) => setMaxTimeBoolean(e.target.checked)} />
              <ToolTip mainText={"Max Time"} toolText={"(optional) The time generation will take (in minutes)"} idName={"max-time"} textBold={false} />
              <input type="text" value={maxTimeString} onChange={(e) => setMaxTimeString(e.target.value)} disabled={!maxTimeBoolean}></input>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <input type="checkbox" checked={maxSchedulesBoolean} onChange={(e) => setMaxSchedulesBoolean(e.target.checked)} />

              <ToolTip
                mainText={"Max Schedules"}
                toolText={`(optional) The max amount of schedules that will be found until generation stops (max being ${numberWithCommas(maxSchedulesAllowed)})`}
                idName={"max-schedules"} textBold={false} />
              <input type="text" value={maxSchedulesString} onChange={(e) => setMaxSchedulesString(e.target.value)} disabled={!maxSchedulesBoolean}></input>
            </div>
          </div>
        )}

        <div style={{ display: "flex", fontSize: "23px", justifyContent: "center", gap: "10px" }}>
          <b>Filters</b>
          <button onClick={() => setShowFilters((b) => !b)}>{showFilters ? "Hide" : "Show"}</button>
        </div>

        {showFilters && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowShiftFilterPopUp(true);
                  setSelectedShiftFilterTime(times[0]);
                  setSelectedShiftFilterDay(days[0]);
                }}
              >
                Add Shift Filter
              </button>
              <button onClick={() => {
                setShowDayFilterPopUp(true);
                setSelectedDayFilterDay(days[0]);
              }}>Add Day Filter</button>
            </div>

            {days.map((day) => (
              <FilterContainer
                abstractShiftFilters={abstractShiftFilters
                  .sort((f1, f2) => {
                    return times.indexOf(f1.time) - times.indexOf(f2.time);
                  })}
                abstractDayFilters={abstractDayFilters}
                mentors={savedMentors}
                day={day}
                globalMinShifts={minMentors}
                globalMaxShift={maxMentors}
                setAbstractFilters={setAbstractShiftFilters}
                showAbstractFilters={showAbstractFilters}
                setShowAbstractFilters={setShowAbstractFilters}
                allowNoneSchedules={allowNoneSchedules} setAbstractDayFilters={setAbstractDayFilters} />
            ))}
            {generatingSchedules && (
              <div>
                <p>Generating Schedules...{formatTime(elapsedTime)}</p>
                <p>Found {numberWithCommas(schedulesFound)} schedules</p>
              </div>
            )}
            {
              /* Pop up for shift filters */
              showShiftFilterPopUp && (
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
                    display: showShiftFilterPopUp ? "show" : "none",
                  }}
                >
                  <div style={{ backgroundColor: "white", margin: "10% auto", padding: "20px", width: "45%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2>Select which day and time the filter should be for</h2>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <select onChange={(e) => setSelectedShiftFilterDay(e.target.value)}>
                        <b>Selected Day</b>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <select onChange={(e) => setSelectedShiftFilterTime(e.target.value)}>
                        {times.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    {foundAbstractShiftFilter() && <p style={{ color: "red" }}>A filter of that day and time already exists</p>}
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={() => setShowShiftFilterPopUp(false)}>Close</button>
                      <button onClick={() => addShiftFilter()} disabled={foundAbstractShiftFilter()}>
                        Add Filter
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            {
              /* pop up for day filter*/
              showDayFilterPopUp && (
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
                    display: showDayFilterPopUp ? "show" : "none",
                  }}
                >
                  <div style={{ backgroundColor: "white", margin: "10% auto", padding: "20px", width: "45%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2>Select which day the filter should be for</h2>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <select onChange={(e) => setSelectedDayFilterDay(e.target.value)}>
                        <b>Selected Day</b>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    {foundAbstractDayFilter() && <p style={{ color: "red" }}>A filter of that day already exists</p>}
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={() => setShowDayFilterPopUp(false)}>Close</button>
                      <button onClick={() => addDayFilter()} disabled={foundAbstractDayFilter()}>
                        Add Filter
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        )}
        <button disabled={generatingSchedules} onClick={() => generateSchedules()}>
          Generate schedules
        </button>
      </div>

      <p>{warningText}</p>
    </div>
  );

  function foundAbstractShiftFilter() {
    return abstractShiftFilters.find((f) => f.day == selectedShiftFilterDay && f.time == selectedShiftFilterTime) != undefined;
  }

  function foundAbstractDayFilter() {
    return abstractDayFilters.find((day) => day == selectedDayFilterDay) != undefined;
  }

  function addShiftFilter() {
    setShowShiftFilterPopUp(false);
    const newArr = [...abstractShiftFilters, { day: selectedShiftFilterDay, time: selectedShiftFilterTime }];
    setAbstractShiftFilters(newArr);
  }

  function addDayFilter() {
    setShowDayFilterPopUp(false);
    const newArr = [...abstractDayFilters, selectedDayFilterDay];
    setAbstractDayFilters(newArr);
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

    if (minMentors > maxMentors) {
      setWarningText('"Minimum mentors per shift" needs to be a number less than "Maximum mentors per shift"');
      return;
    }


    //get the filters

    let shiftFilters: FilterInterface[] = [];
    const dayFilters: DayFilterInterface[] = [];

    let warningPrefix;
    //get the day filters
    console.log(abstractDayFilters);
    for (const day of abstractDayFilters) {

      warningPrefix = `The day filter "${day}" invalid:`;
      const noMentors = (document.querySelector(`#day-filter-${day}-nobody-works`) as HTMLInputElement).checked;
      const minCount = parseInt((document.querySelector(`#day-filter-${day}-min-count`) as HTMLSelectElement).value);
      const maxCount = parseInt((document.querySelector(`#day-filter-${day}-max-count`) as HTMLSelectElement).value);

      //check of the day filter is redundant
      if (!noMentors && minCount == minMentors && maxCount == maxMentors) {
        setWarningText(`${warningPrefix} This is redundant. Either edit or remove it`);
        return;
      }

      //make the day filter
      //if noMentors is true, make minMentors and maxMentors 0
      //otherwise set it to the parametrized values
      const dayFilter: DayFilterInterface = { day, noMentors, minMentors: noMentors ? 0 : minCount, maxMentors: noMentors ? 0 : maxCount };
      dayFilters.push(dayFilter);

      //for each shift, check if that shift has a filter
      for (const time of times) {
        const abstractFilter = abstractShiftFilters.find(f => f.day === day && f.time === time);
        //if there is a shift filter, add that filter to this list
        if (abstractFilter !== undefined) {
          const filter = registerShiftFilter(abstractFilter, shiftFilters, dayFilter);
          console.log(filter);
          //if the filter is a string, set a warning and end the generation
          if (typeof filter === "string") {
            setWarningText(filter);
            return;
          }

          //otherwise add the filter
          if (filter !== null) {
            shiftFilters.push(filter);
          }
        }

        else {
          //if there isn't a shift filter, make one with the day filter options
          shiftFilters.push({ day: dayFilter.day, time, noMentors: dayFilter.noMentors, minMentors: dayFilter.minMentors, maxMentors: dayFilter.maxMentors, names: [] } as FilterInterface);
        }
      }

    }



    //get the shift filters
    for (const abstractFilter of abstractShiftFilters) {
      const dayFilter = dayFilters.find(f => f.day === abstractFilter.day) ?? null;
      const filter = registerShiftFilter(abstractFilter, shiftFilters, dayFilter);

      //set warning text if filter is invalid
      if(typeof filter === "string") {
        setWarningText(filter);
        return;
      }

      //don't register if already registered
      else if(filter !== null) {
        shiftFilters.push(filter);
      }
    }

    console.log(shiftFilters);

    //set the starting time and start generation
    const startTime = new Date().getTime();
    setStartingTime(startTime);
    setElapsedTime(0);
    setGeneratingSchedules(true);
    setSchedulesFound(0);
    await new Promise((r) => setTimeout(r, pauseTime));

    //get all of the possible shift (one mentor) for each block
    const allDayPossibilities: { [key: string]: Day[] } = {};

    for (const day of days) {
      await new Promise((r) => setTimeout(r, pauseTime));
      allDayPossibilities[day] = getAllDayPossibilities(day, shiftFilters, maxShiftsNumber);
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

  function registerShiftFilter(abstractFilter: AbstractShiftFilter, registeredShiftFilters: FilterInterface[], dayFilter: DayFilterInterface | null) {
    {
      const day = abstractFilter.day;
      const time = abstractFilter.time;


      //don't do anything if the filter was already registered
      if (registeredShiftFilters.find(f => f.day === day && f.time === time) !== undefined) {
        return null;
      }
      const warningPrefix = `The filter for ${day} at ${time} is invalid:`;

      //get "nobody works this shift" boolean
      const noMentors = (document.querySelector(`#${day}-${time}-nobody-works`) as HTMLInputElement).checked;

      //get min amount of mentors
      const minCount: number = parseInt((document.querySelector(`#${day}-${time}-min-count`) as HTMLSelectElement).value);

      //get max amount of mentors
      const maxCount: number = parseInt((document.querySelector(`#${day}-${time}-max-count`) as HTMLSelectElement).value);

      //get the filtered mentors
      const filteredNames = Array.from({ length: 3 })
        .map((_, ix) => document.querySelector(`#${day}-${time}-${ix}`))
        .filter((element): element is HTMLSelectElement => element !== null)
        .map((ele) => ele.value)
        .filter((name): name is string => name !== "Any");

      //check that the shift filter is redundant because of the day filter
      //noMentors is true, and is the same as the day filter
      //noMentors is false the minCount and maxCount is the same, but there are no required mentors
      if (dayFilter !== null && (
        (noMentors && noMentors == dayFilter.noMentors && filteredNames.length === 0) ||
        !noMentors && noMentors == dayFilter.noMentors && minCount === dayFilter.minMentors && maxCount === dayFilter.maxMentors && filteredNames.length === 0)) {
        return `${warningPrefix} redundant due to day filter.`;
      }

      //if "nobody works this shift" is on, then force None to be the only valid thing on that day
      if (noMentors) {
        return { day, time, noMentors, minMentors: 1, maxMentors: 1, names: [] } as FilterInterface;
      } else {
        //verify that min shift is less than or equal max shift
        if (minCount > maxCount) {
          return `${warningPrefix} Min Shifts cannot be greater than Max Shifts`;
        }

        //if the minCount and maxCount is the same as the global ones and there aren't any mentors suggested
        if (minCount == minMentors && maxCount == maxMentors && filteredNames.length == 0) {
          return `${warningPrefix} This is redundant. Either edit or remove it`;
        }

        //verify that any mentors dropdowns that are not "Any", are not duplicate
        const arr: string[] = [];
        for (const name of filteredNames) {
          if (arr.find((n: string) => n == name) == undefined) {
            arr.push(name);
          } else {
            return `${warningPrefix} \"Mentors\" cannot have duplicate names (besides \"Any\")`;
          }
        }

        return { day, time, noMentors, minMentors: minCount, maxMentors: maxCount, names: filteredNames } as FilterInterface;
      }
    }
  }

  function getMentorCountDropDown(onChangeMethod: React.Dispatch<React.SetStateAction<number>>) {
    return (
      <select onChange={(e) => onChangeMethod(parseFloat(e.target.value))}>
        {Array.from({ length: 3 }).map((_, ix) => (
          <option key={ix + 1} value={ix + 1}>
            {ix + 1}
          </option>
        ))}
      </select>
    );
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

    //only allow "None" to exist if allowNoneSchedules is true
    if (allowNoneSchedules) {
      names.push("None");
    }

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
  function getAllDayPossibilities(day: string, filters: FilterInterface[], maxShift: number): Day[] {
    interface DayInfo {
      day: Day;
      maxMentorCount: number;
      nameList: string[];
    }
    const allDayPossibilities: DayInfo[] = []; //all possibilities of the parameter "day"
    const shiftPossibilities: { [key: string]: string[][] } = {}; //all possibilities of a specific time of the "day" parameter

    for (const time of times) {
      const relevantFilter = filters.find(filter => filter.day == day && filter.time == time)
      const newMinMentorPerShift = relevantFilter?.minMentors ?? minMentors;
      const newMaxMentorPerShift = relevantFilter?.maxMentors ?? maxMentors;
      shiftPossibilities[time] = getTotalCombination(day, times.indexOf(time), relevantFilter, newMinMentorPerShift, newMaxMentorPerShift);
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
  function getTotalCombination(day: string, index: number, filter: FilterInterface | undefined, min: number, max: number): string[][] {

    //if noMentors is true, the only allow None to be the only thing possible for that shift
    if (filter?.noMentors) {
      return [['None']]
    }

    //get a list of the mentors
    const mentors = getAllTimeShifts(day, index);
    const results: string[][] = [];
    //get combinations from lengths [max, min] inclusively
    for (let i = min; i <= max; i++) {
      const r = getCombinations(mentors, i);

      //if there is a filter, make sure required names are on the list
      for (const arr of r) {
        if (filter == undefined || filter.names.every((requiredName) => arr.includes(requiredName))) {
          results.push(arr);
        }
      }
    }

    return results;
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
