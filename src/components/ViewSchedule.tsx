"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { Day } from "@/app/interface/Day"
import { useState, useEffect } from "react";
import IndividualSchedule from "./IndividualSchedule";
import { FilterInterface } from "@/app/interface/Filter";
import NavBar from "./NavBar";
const ViewSchedule = () => {
    const notifSound = "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3";
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = ["10", "11", "12", "1", "2", "3", "4", "5"];
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
    //assumes there is only one person on shift
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <NavBar />
            <h4>Force All Mentors</h4>
            <input type="checkbox" checked={forceAllMentorsBoolean} onChange={e => setForceAllMentorsBoolean(e.target.checked)} />
            <p>Only gives schedules where all mentors have at least one shift</p>
            <h4>Max Shifts</h4>
            <p>The max amount of shifts each mentor is allowed to work in a week</p>
            <input type="text" value={maxShiftsString} onChange={e => setMaxShiftsString(e.target.value)}></input>
            <h4>Max Time</h4>
            <input type="checkbox" checked={maxTimeBoolean} onChange={e => setMaxTimeBoolean(e.target.checked)} />
            <p>The time generation will take (in minutes)</p>
            <input type="text" value={maxTimeString} onChange={e => setMaxTimeString(e.target.value)} disabled={!maxTimeBoolean}></input><br />
            <h4>Max Schedules</h4>
            <input type="checkbox" checked={maxSchedulesBoolean} onChange={e => setMaxSchedulesBoolean(e.target.checked)} />
            <p>The max amount of schedules that will be found until generation stops</p>
            <input type="text" value={maxSchedulesString} onChange={e => setMaxSchedulesString(e.target.value)} disabled={!maxSchedulesBoolean}></input><br />

            <h2>Filters</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {days.map(day => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {times.map(time => (
                        <tr key={time}>
                            <td>{time}</td>
                            {days.map(day => (
                                <td key={`${day}-${time}`}>
                                    {getDropDown(`${day}-${time}`)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => generateSchedules()}>Generate schedules</button>
            {possibleSchedules?.filter((_, ix) => ix === 0).map(schedule => <IndividualSchedule schedule={schedule} days={days} times={times}/>)}
            <p>{warningText}</p>
        </div>
    );

    function generateSchedules() {
        setWarningText("");
        if (savedMentors.length === 0) {
            setWarningText("No mentors saved in local storage");
            return;
        }

        const maxShiftsNumber = parseInt(maxShiftsString);

        if (Number.isNaN(maxShiftsNumber) || maxShiftsNumber < 1) {
            setWarningText("\"Max Shift\" needs to be a number greater than 0");
            return;
        }
        const maxTimeNumber = parseInt(maxTimeString);
        if (Number.isNaN(maxShiftsNumber) || maxShiftsNumber < 1) {
            setWarningText("\"Max Shift\" needs to be a number greater than 0");
            return;
        }

        const maxSchedulesNumber = parseInt(maxSchedulesString);
        if (Number.isNaN(maxSchedulesNumber) || maxSchedulesNumber < 1) {
            setWarningText("\"Max Schedules\" needs to be a number greater than 0");
            return;
        }

        if(savedMentorNames.length > 40) {
            setWarningText(`Impossible to have ${savedMentorNames.length} mentors have at least one shift`)
            return;
        }

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

        const startTime = new Date().getTime();

        //get all of the possible shift (one mentor) for each block
        const allDayPossibilities: { [key: string]: Day[] } = {};

        days.forEach(day => {
            let possibilities = getDayShifts(day, maxShiftsNumber);
            possibilities = findLeastNoneShifts(possibilities);
            possibilities = applyCustomFilters(possibilities, day, filters);
            allDayPossibilities[day] = possibilities;
            console.log(possibilities);
        });
        //the length of all possibilities multiplied together
        const expectedResultNumber = Object.values(allDayPossibilities).reduce((acc, possibilities) => acc * possibilities.length, 1);
        console.log(`Estimated number of results is ${expectedResultNumber}`);
        const schedules = [] as any[];

        function generateSchedulesRecursion(dayIndex: number, currentSchedule: any, scheduleNameList: string[]): any {
            //base case: Friday has been processed
            if(dayIndex >= days.length) {
                if(forceAllMentorsBoolean) {
                    const peopleCount = savedMentorNames.map(name => itemCounter(scheduleNameList, name));
                    if(peopleCount.every(num => num > 0)) {
                        schedules.push(currentSchedule);
                    }
                }

                else {
                    schedules.push(currentSchedule);
                }
                
                return currentSchedule;
            }
    
            const day = days[dayIndex];
            for(const shift of allDayPossibilities[day]) {
                
                if (maxTimeExceeded(maxTimeNumber, startTime)) {
                    setWarningText("Elapsed Time has exceeded max time");
                    break;
                }

                if (maxSchedulesExceeded(maxSchedulesNumber, schedules.length)) {
                    setWarningText(`Found ${maxSchedulesNumber} schedule(s)`);
                    break;
                }

                const shiftNames =  Object.values(shift).flatMap(arr => arr) as unknown as string[];
                const newScheduleNameList = scheduleNameList.concat(shiftNames);
    
                const newSchedule = {...currentSchedule, [day]: shift};
                //verify that nobody has worked more than the max amount of hours
                if (exceedHourLimit(newScheduleNameList, maxShiftsNumber)) {
                    continue;
                }

                generateSchedulesRecursion(dayIndex + 1, newSchedule, newScheduleNameList);
            }
        }

        generateSchedulesRecursion(0, {},[]);

        const elapsedSeconds = getElapsedSeconds(startTime);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const secs = elapsedSeconds % 60;

        // Pad hours, minutes, and seconds with leading zeros if necessary
        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(secs).padStart(2, '0');

        // Return formatted time string
        console.log(`${paddedHours}:${paddedMinutes}:${paddedSeconds}`);
        console.log("result", schedules);
        setPossibleSchedules(schedules);

        //play sound to notify user that it's done
        new Audio(notifSound).play()

    }

    //get all the shifts for a specific day
    function getDayShifts(specifiedDay: string, maxShiftsNumber: number): Day[] {
        if (savedMentors === undefined) {
            setWarningText(`There was an error getting day shifts for ${specifiedDay}`)
            return [];
        }

        //all the mentors that are available some time on the specified day
        const allAvailableMentors: { [key: string]: string[] } = times.reduce(function(obj, time) {
            return {...obj, [time]: getAllTimeShifts(specifiedDay, times.indexOf(time))}
        }, {});

        // All of the possible ways to configure a day (assumes having 1 mentor per shift)
        const allDayPossibilities: Day[] = [];

        // Todo: refactor this so in the rare case this does happen, make it so this error is handled
        if (Object.values(allAvailableMentors).some(v => v === undefined)) {
            console.log("A problem occurred");
            return [];
        }

        function getAllDayPossibilities(timeIndex: number, currentDaySchedule: any) {
            //base case 5pm has been processed
            if(timeIndex >= times.length) {
                const names = Object.values(currentDaySchedule).flatMap(arr => arr) as unknown as string[];
                if(!exceedHourLimit(names, maxShiftsNumber)) {
                    allDayPossibilities.push(currentDaySchedule);
                }
                return currentDaySchedule;
            }

            const time = times[timeIndex];
            for(const shift of allAvailableMentors[time]) {
                const newSchedule = {...currentDaySchedule, [time]: [shift]};
                getAllDayPossibilities(timeIndex + 1, newSchedule);
            }
        }

        getAllDayPossibilities(0, {});
        return allDayPossibilities;
    }

    //get all the people who can work a specific shift on a specific day and time
    function getAllTimeShifts(specifiedDay: string, index: number): string[] {
        if (savedMentors === undefined) {
            setWarningText(`There was an error getting all the people who can work on ${specifiedDay} at ${times[0]}`)
            return [];
        }

        //automatically assume that nobody working the shift is an option
        const shifts = ["None"];

        //assume one mentor is working the shift
        savedMentors.forEach(m => {
            Object.keys(m.availability).forEach(day => {
                if (day == specifiedDay && m.availability[day as keyof MentorInterface['availability']][index]) {
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
    };

    function exceedHourLimit(people: string[], maxShiftsNumber: number) {
        //assumes there is only one mentor on shift
        const peopleCount = savedMentorNames.map(name => itemCounter(people, name));
        return peopleCount.some(num => num > maxShiftsNumber);
    }

    //find the least amount of times None appears in a day
    function findLeastNoneShifts(allDayShifts: Day[]) {
        const noneShiftCount = allDayShifts.map((possibility: Day) => {
            const names = Object.values(possibility).map(arr => arr[0]).filter(name => name === "None");
            return names.length;
        });

        let smallestNumber = structuredClone(noneShiftCount).sort()[0];
        const desiredShifts = allDayShifts.filter((_, ix) => noneShiftCount[ix] == smallestNumber);
        return desiredShifts;
    }

    //filter out shifts based custom filters
    function applyCustomFilters(allDayShifts: Day[], specifiedDay: string, filters: FilterInterface[]) {
        if (Object.values(filters).length === 0)
            return allDayShifts;
        const relevantFilters = Object.values(filters).filter(filter => filter.selectedDay === specifiedDay);
        //apply filter on each day
        let filteredDays = [...allDayShifts]; // Don't modify the original
        for (const filter of relevantFilters) {
            filteredDays = filteredDays.filter(day => day[filter.selectedTime as keyof Day].includes(filter.selectedMentor));
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
        const validMentors = savedMentors.filter(mentor => mentor.availability[day as keyof MentorInterface['availability']][timeIndex]);
        const names = validMentors.map(mentor => mentor.name);
        names.splice(0, 0, "Any");
        return <select id={id}>
            {names.map(name => (
                <option key={name} value={name}>
                    {name}
                </option>
            ))}
        </select>
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
}

export default ViewSchedule;