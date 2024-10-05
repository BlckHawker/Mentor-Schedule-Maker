"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { Day } from "@/app/interface/Day";
import { useState, useEffect } from "react";
import IndividualSchedule from "./IndividualSchedule";
import { FilterInterface } from "@/app/interface/Filter";
import NavBar from "./NavBar";
const GenerateSchedule = () => {
  const pauseTime = 1;
  const maxSchedulesAllowed = 1000000; //physically can't add anymore to an array
  const notifSound = "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3";
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["10", "11", "12", "1", "2", "3", "4", "5"];
  const [schedulesFound, setSchedulesFound] = useState(0);
  const [startingTime, setStartingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [generatingSchedules, setGeneratingSchedules] = useState(false);
  const [forceAllMentorsBoolean, setForceAllMentorsBoolean] = useState(true);
  const [maxTimeBoolean, setMaxTimeBoolean] = useState(false);
  const [maxSchedulesBoolean, setMaxSchedulesBoolean] = useState(true);
  const [maxTimeString, setMaxTimeString] = useState("1");
  const [maxSchedulesString, setMaxSchedulesString] = useState("30");
  const [maxShiftsString, setMaxShiftsString] = useState("4");
  const [isLoading, setIsLoading] = useState(false);
  const [savedMentors, setSavedMentors] = useState<MentorInterface[]>([]);
  const [savedMentorNames, setSavedMentorNames] = useState<string[]>([]);
  const [possibleSchedules, setPossibleSchedules] = useState<Schedule[]>();
  const [warningText, setWarningText] = useState("");

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
      let interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startingTime) / 1000)), 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [generatingSchedules]);

  //assumes there is only one person on shift
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <NavBar />
      <h4>Force All Mentors</h4>
      <input type="checkbox" checked={forceAllMentorsBoolean} onChange={(e) => setForceAllMentorsBoolean(e.target.checked)} />
      <p>Only gives schedules where all mentors have at least one shift</p>
      <h4>Max Shifts</h4>
      <p>The max amount of shifts each mentor is allowed to work in a week</p>
      <input type="text" value={maxShiftsString} onChange={(e) => setMaxShiftsString(e.target.value)}></input>
      <h4>Max Time</h4>
      <input type="checkbox" checked={maxTimeBoolean} onChange={(e) => setMaxTimeBoolean(e.target.checked)} />
      <p>The time generation will take (in minutes)</p>
      <input type="text" value={maxTimeString} onChange={(e) => setMaxTimeString(e.target.value)} disabled={!maxTimeBoolean}></input>
      <br />
      <h4>Max Schedules</h4>
      <input type="checkbox" checked={maxSchedulesBoolean} onChange={(e) => setMaxSchedulesBoolean(e.target.checked)} />
      <p>The max amount of schedules that will be found until generation stops</p>
      <input type="text" value={maxSchedulesString} onChange={(e) => setMaxSchedulesString(e.target.value)} disabled={!maxSchedulesBoolean}></input>
      <br />

      <h2>Filters</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {days.map((day) => (
                <td key={`${day}-${time}`}>{getDropDown(`${day}-${time}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button disabled={generatingSchedules} onClick={() => generateSchedules()}>
        Generate schedules
      </button>
      <button onClick={() => getAllSchedules()}>Get Permutations</button>
      {generatingSchedules && (
        <div>
          <p>Generating Schedules...{formatTime(elapsedTime)}</p>
          <p>Found {numberWithCommas(schedulesFound)} schedules</p>
        </div>
      )}
      <p>{warningText}</p>
    </div>
  );

  async function generateSchedules() {
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

    //todo: remove this once combination is implemented
    if (forceAllMentorsBoolean && savedMentorNames.length > 40) {
      setWarningText(`Impossible to have ${savedMentorNames.length} mentors have at least one shift`);
      return;
    }

    const startTime = new Date().getTime();
    setStartingTime(startTime);
    setElapsedTime(0);
    setGeneratingSchedules(true);
    setSchedulesFound(0);
    await new Promise((r) => setTimeout(r, pauseTime));

    //get new filters
    const filters: FilterInterface[] = [];

    for (const selectedDay of days) {
      for (const selectedTime of times) {
        const selectedMentor = (document.querySelector(`#${selectedDay}-${selectedTime}`) as HTMLInputElement).value;
        if (selectedMentor !== "Any") {
          filters.push({ selectedMentor, selectedDay, selectedTime });
        }
      }
    }

    //get all of the possible shift (one mentor) for each block
    const allDayPossibilities: { [key: string]: Day[] } = {};

    for (const day of days) {
      await new Promise((r) => setTimeout(r, pauseTime));
      let possibilities = getDayShifts(day, maxShiftsNumber);
      possibilities = findLeastNoneShifts(possibilities);
      possibilities = applyCustomFilters(possibilities, day, filters);
      allDayPossibilities[day] = possibilities;
    }

    //the length of all possibilities multiplied together
    const expectedResultNumber = Object.values(allDayPossibilities).reduce((preVal, possibilities) => preVal * possibilities.length, 1);
    console.log(`Estimated number of results is ${expectedResultNumber}`);
    const schedules = [] as any[];

    async function generateSchedulesRecursion(dayIndex: number, currentSchedule: any, scheduleNameList: string[]): Promise<any> {
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
      for (const shift of allDayPossibilities[day]) {
        if (maxTimeExceeded(maxTimeNumber, startTime) || maxSchedulesExceeded(maxSchedulesNumber, schedules.length) || schedules.length >= maxSchedulesAllowed) {
          break;
        }

        const shiftNames = Object.values(shift).flatMap((arr) => arr) as unknown as string[];
        const newScheduleNameList = scheduleNameList.concat(shiftNames);

        const newSchedule = { ...currentSchedule, [day]: shift };
        //verify that nobody has worked more than the max amount of hours
        if (exceedHourLimit(newScheduleNameList, maxShiftsNumber)) {
          continue;
        }

        await generateSchedulesRecursion(dayIndex + 1, newSchedule, newScheduleNameList);
      }
    }

    await generateSchedulesRecursion(0, {}, []);

    const elapsedSeconds = getElapsedSeconds(startTime);

    setWarningText(`Found ${numberWithCommas(schedules.length)} schedule(s) in ${formatTime(elapsedSeconds)}`);
    setPossibleSchedules(schedules);

    //play sound to notify user that generation is done
    new Audio(notifSound).play();
    setGeneratingSchedules(false);
  }

  //refactor number to have commas
  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //refactor elapsedSeconds to be days, hours, minutes, seconds
  function formatTime(seconds: number) {
    const days = Math.floor(seconds / 86400);
    seconds = seconds % 86400;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

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

    str += ` ${seconds}s`;

    return str.trim();
  }

  //get all the shifts for a specific day
  function getDayShifts(specifiedDay: string, maxShiftsNumber: number): Day[] {
    if (savedMentors === undefined) {
      setWarningText(`There was an error getting day shifts for ${specifiedDay}`);
      return [];
    }

    const allAvailableMentors: { [key: string]: string[] } = {};

    for (const time of times) {
      const timeShift = getAllTimeShifts(specifiedDay, times.indexOf(time));
      console.log(timeShift);
      // Todo: refactor this so in the rare case this does happen, make it so this error is handled
      if (timeShift === undefined) {
        console.log("A problem occurred");
        return [];
      }
      allAvailableMentors[time] = timeShift;
    }

    // All of the possible ways to configure a day (assumes having 1 mentor per shift)
    const allDayPossibilities: Day[] = [];

    function getAllDayPossibilities(timeIndex: number, currentDaySchedule: any) {
      //base case 5pm has been processed
      if (timeIndex >= times.length) {
        const names = Object.values(currentDaySchedule).flatMap((arr) => arr) as unknown as string[];
        if (!exceedHourLimit(names, maxShiftsNumber)) {
          allDayPossibilities.push(currentDaySchedule);
        }
        return currentDaySchedule;
      }

      const time = times[timeIndex];
      for (const shift of allAvailableMentors[time]) {
        const newSchedule = { ...currentDaySchedule, [time]: [shift] };
        getAllDayPossibilities(timeIndex + 1, newSchedule);
      }
    }

    getAllDayPossibilities(0, {});
    return allDayPossibilities;
  }

  //get all the people who can work a specific shift on a specific day and time
  function getAllTimeShifts(specifiedDay: string, index: number): string[] {
    if (savedMentors === undefined) {
      setWarningText(`There was an error getting all the people who can work on ${specifiedDay} at ${times[0]}`);
      return [];
    }

    //automatically assume that nobody working the shift is an option
    const shifts = ["None"];

    //assume one mentor is working the shift
    savedMentors.forEach((m) => {
      Object.keys(m.availability).forEach((day) => {
        if (day == specifiedDay && m.availability[day as keyof MentorInterface["availability"]][index]) {
          shifts.push(m.name);
        }
      });
    });

    return shifts;
  }

  //Tells how many times each name has occurred in an array
  //assumes there's only one person in the list
  function itemCounter(arr: string[], value: string) {
    return arr.filter((x) => x === value).length;
  }

  function exceedHourLimit(people: string[], maxShiftsNumber: number) {
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

  //find the least amount of times None appears in a day
  function findLeastNoneShifts(allDayShifts: Day[]) {
    const noneShiftCount = allDayShifts.map((possibility: Day) => {
      return Object.values(possibility)
        .map((arr) => arr[0])
        .filter((name) => name === "None").length;
    });

    let smallestNumber = structuredClone(noneShiftCount).sort()[0];
    const desiredShifts = allDayShifts.filter((_, ix) => noneShiftCount[ix] == smallestNumber);
    return desiredShifts;
  }

  //filter out shifts based custom filters
  function applyCustomFilters(allDayShifts: Day[], specifiedDay: string, filters: FilterInterface[]) {
    if (Object.values(filters).length === 0) return allDayShifts;
    const relevantFilters = Object.values(filters).filter((filter) => filter.selectedDay === specifiedDay);
    //apply filter on each day
    let filteredDays = [...allDayShifts]; // Don't modify the original
    for (const filter of relevantFilters) {
      filteredDays = filteredDays.filter((day) => day[filter.selectedTime as keyof Day].includes(filter.selectedMentor));
    }

    return filteredDays;
  }

  function getDropDown(id: string) {
    if (isLoading || savedMentors === undefined) {
      return "";
    }
    const day = id.split("-")[0];
    const time = id.split("-")[1];
    const timeIndex = times.indexOf(time);
    const validMentors = savedMentors.filter((mentor) => mentor.availability[day as keyof MentorInterface["availability"]][timeIndex]);
    const names = validMentors.map((mentor) => mentor.name);
    names.splice(0, 0, "Any");
    return (
      <select id={id}>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    );
  }

  function getElapsedSeconds(startTime: number) {
    return Math.floor((new Date().getTime() - startTime) / 1000);
  }

  function getElapsedMinutes(startTime: number) {
    const elapsedSeconds = getElapsedSeconds(startTime);
    return Math.floor((elapsedSeconds % 3600) / 60);
  }

  function maxTimeExceeded(maxTimeNumber: number, startTime: number) {
    const minutes = getElapsedMinutes(startTime);
    return maxTimeBoolean && minutes >= maxTimeNumber;
  }

  function maxSchedulesExceeded(maxScheduleNumber: number, scheduleCount: number) {
    return maxSchedulesBoolean && scheduleCount >= maxScheduleNumber;
  }

  function getAllSchedules() {
    //todo get the parameter from the user
    const maxShifts = 4;
    const maxSchedules = 1;
    const filters: FilterInterface[] = [];

    for (const selectedDay of days) {
      for (const selectedTime of times) {
        const selectedMentor = (document.querySelector(`#${selectedDay}-${selectedTime}`) as HTMLInputElement).value;
        if (selectedMentor !== "Any") {
          filters.push({ selectedMentor, selectedDay, selectedTime });
        }
      }
    }

    const allDayPossibilities: { [key: string]: Day[] } = {};

    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const filtersByDay = filters.filter((f) => f.selectedDay === day);
      allDayPossibilities[day] = getAllDayPermutationsRecursion(day, filtersByDay);
      console.log(allDayPossibilities[day])
    }

    const schedules: Schedule[] = [];

    for (const monday of allDayPossibilities["Monday"]) {
      const schedule = { Monday: monday } as Schedule;
      const mondayNames = Object.values(monday).flatMap((arr) => arr);
      if (schedules.length >= maxSchedules) {
        break;
      }
      if (exceedHourLimit(mondayNames, maxShifts)) {
        continue;
      }
      for (const tuesday of allDayPossibilities["Tuesday"]) {
        schedule["Tuesday"] = tuesday;
        const tuesdayNames = Object.values(tuesday).flatMap((arr) => arr);
        if (schedules.length >= maxSchedules) {
          break;
        }
        if (exceedHourLimit(mondayNames.concat(tuesdayNames), maxShifts)) {
          continue;
        }
        for (const wednesday of allDayPossibilities["Wednesday"]) {
          schedule["Wednesday"] = wednesday;
          const wednesdayNames = Object.values(wednesday).flatMap((arr) => arr);
          if (schedules.length >= maxSchedules) {
            break;
          }
          if (exceedHourLimit(mondayNames.concat(tuesdayNames).concat(wednesdayNames), maxShifts)) {
            continue;
          }
          for (const thursday of allDayPossibilities["Thursday"]) {
            schedule["Thursday"] = thursday;
            const thursdayNames = Object.values(thursday).flatMap((arr) => arr);
            if (schedules.length >= maxSchedules) {
              break;
            }
            if (exceedHourLimit(mondayNames.concat(tuesdayNames).concat(wednesdayNames).concat(thursdayNames), maxShifts)) {
              continue;
            }
            for (const friday of allDayPossibilities["Friday"]) {
              schedule["Friday"] = friday;
              const fridayNames = Object.values(friday).flatMap((arr) => arr);
              if (schedules.length >= maxSchedules) {
                break;
              }
              if (exceedHourLimit(mondayNames.concat(tuesdayNames).concat(wednesdayNames).concat(thursdayNames).concat(fridayNames), maxShifts)) {
                continue;
              }
              console.log("schedule added");
              schedules.push(schedule);
            }
          }
        }
      }
    }

    console.log(schedules);
  }

  function getAllDayPermutationsRecursion(day: string, filters: FilterInterface[]): Day[] {
    //todo replace the "max shift" parameter
    const maxShift = 4;
    //todo make this a parameter at the top of the file
    const maxPossibilities = 1000000; //max # of day possibilities generated
    const allDayPossibilities: Day[] = [];

    const shiftPossibilities: { [key: string]: string[][] } = {};

    for (let i = 0; i < times.length; i++) {
      //todo: replace [] with the filters for that specific day/time
      const filterByTime = filters.filter((f) => f.selectedTime === times[i]);
      shiftPossibilities[times[i]] = getTotalCombination(day, i, filterByTime);
    }
    function m(timeIndex: number, currentDaySchedule: any) {
      if (timeIndex >= times.length) {
        const names = Object.values(currentDaySchedule).flatMap((arr) => arr) as string[];
        if (!exceedHourLimit(names, maxShift)) {
          allDayPossibilities.push(currentDaySchedule);
        }
        return currentDaySchedule;
      }

      const time = times[timeIndex];
      for (const shift of shiftPossibilities[time]) {
        if (allDayPossibilities.length >= maxPossibilities) {
          break;
        }
        const newSchedule = { ...currentDaySchedule, [time]: shift };
        m(timeIndex + 1, newSchedule);
      }
    }

    m(0, {});

    //for each possibility, make an dictionary where the key is the mentor name and the value is the count of said mentor

    function onlyUnique(value: string, index: number, array: string[]) {
      return array.indexOf(value) === index;
    }

    function getMaxNameCount(day: Day) {
      const nameList = Object.values(day).flatMap((arr) => arr);
      const distinctNames = nameList.filter(onlyUnique);
      const nameCount = distinctNames.map((name) => itemCounter(nameList, name));
      return Math.max(...nameCount);
    }

    // const maxCountArr = allDayPossibilities.map(d => getMaxNameCount(d));
    // let sortedArrIndices = [] as number[];
    // let count = 0;
    // do {
    //     const validIndices = maxCountArr.map((num, ix) => num === count ? ix : undefined).filter(ix => ix);
    //     if(validIndices.length != 0) {
    //         sortedArrIndices = sortedArrIndices.concat(validIndices as number[]);
    //     }
    //     count++;
    // } while(sortedArrIndices.length != allDayPossibilities.length)
    // console.log(sortedArrIndices);

    //todo possibly make this generation faster by holding the value that 
    //todo "getMaxNameCount" returns in an array for each element in "allDayPossibilities"
    function compareDayPossibility(a: Day, b: Day) {

        return getMaxNameCount(a) - getMaxNameCount(b);
    }
    
    return allDayPossibilities.sort(compareDayPossibility)
  }

  function getTotalCombination(day: string, index: number, filters: FilterInterface[]) {
    //todo replace this with parameters from the user
    const max = 3;
    const min = 1;

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

    return results;
  }

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

    // remove any arrays with "None"
    const finalResults: string[][] = [];

    for (const arr of result) {
      if (arr.includes("None")) {
        continue;
      }

      finalResults.push(arr);
    }
    return finalResults;
  }
};

export default GenerateSchedule;
