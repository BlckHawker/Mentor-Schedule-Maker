"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { Day } from "@/app/interface/Day"
import { useState, useEffect } from "react";
import IndividualSchedule from "./IndividualSchedule";
import Filter from "./Filter";
import { FilterInterface } from "@/app/interface/Filter";
import NavBar from "./NavBar";

const ViewSchedule = () => {
    const emptyDay = {
        "10": [],
        "11": [],
        "12": [],
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
    }
    let startStopwatch = false;
    let startTime: number;
    const [maxShiftsString, setMaxShiftsString] = useState("4");
    const [isLoading, setIsLoading] = useState(false);
    const [savedMentors, setSavedMentors] = useState<MentorInterface[]>();
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
            <h4>Max hours</h4>
            <input type="text" value={maxShiftsString} onChange={e => setMaxShiftsString(e.target.value)}></input><br />
            <button onClick={() => generateSchedules()}>Generate schedules</button>
            {possibleSchedules?.filter((_, ix) => ix === 0).map(schedule => <IndividualSchedule {...schedule}></IndividualSchedule>)}
            <h2>Filters</h2>
            <table>
                <tr>
                    <td></td>
                    <td>Monday</td>
                    <td>Tuesday</td>
                    <td>Wednesday</td>
                    <td>Thursday</td>
                    <td>Friday</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>{getDropDown("Monday-10")}</td>
                    <td>{getDropDown("Tuesday-10")}</td>
                    <td>{getDropDown("Wednesday-10")}</td>
                    <td>{getDropDown("Thursday-10")}</td>
                    <td>{getDropDown("Friday-10")}</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>{getDropDown("Monday-11")}</td>
                    <td>{getDropDown("Tuesday-11")}</td>
                    <td>{getDropDown("Wednesday-11")}</td>
                    <td>{getDropDown("Thursday-11")}</td>
                    <td>{getDropDown("Friday-11")}</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td>{getDropDown("Monday-12")}</td>
                    <td>{getDropDown("Tuesday-12")}</td>
                    <td>{getDropDown("Wednesday-12")}</td>
                    <td>{getDropDown("Thursday-12")}</td>
                    <td>{getDropDown("Friday-12")}</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>{getDropDown("Monday-1")}</td>
                    <td>{getDropDown("Tuesday-1")}</td>
                    <td>{getDropDown("Wednesday-1")}</td>
                    <td>{getDropDown("Thursday-1")}</td>
                    <td>{getDropDown("Friday-1")}</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>{getDropDown("Monday-2")}</td>
                    <td>{getDropDown("Tuesday-2")}</td>
                    <td>{getDropDown("Wednesday-2")}</td>
                    <td>{getDropDown("Thursday-2")}</td>
                    <td>{getDropDown("Friday-2")}</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>{getDropDown("Monday-3")}</td>
                    <td>{getDropDown("Tuesday-3")}</td>
                    <td>{getDropDown("Wednesday-3")}</td>
                    <td>{getDropDown("Thursday-3")}</td>
                    <td>{getDropDown("Friday-3")}</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>{getDropDown("Monday-4")}</td>
                    <td>{getDropDown("Tuesday-4")}</td>
                    <td>{getDropDown("Wednesday-4")}</td>
                    <td>{getDropDown("Thursday-4")}</td>
                    <td>{getDropDown("Friday-4")}</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>{getDropDown("Monday-5")}</td>
                    <td>{getDropDown("Tuesday-5")}</td>
                    <td>{getDropDown("Wednesday-5")}</td>
                    <td>{getDropDown("Thursday-5")}</td>
                    <td>{getDropDown("Friday-5")}</td>
                </tr>
            </table>
            <p>{warningText}</p>
        </div>
    );

    function generateSchedules() {
        setWarningText("");

        if (savedMentors === undefined) {
            console.log("There was an error");
            return;
        }

        const maxShiftsNumber = parseInt(maxShiftsString);

        if (Number.isNaN(maxShiftsNumber) || maxShiftsNumber < 1) {
            setWarningText("\"Max Shift\" needs to be a number greater than 0");
            return;
        }


        //get new filters
        const filters : FilterInterface[] = [];

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const times = ["10", "11", "12", "1", "2", "3", "4", "5"]

        for(const selectedDay of days) {
            for(const selectedTime of times) {
                const selectedMentor = document.querySelector(`#${selectedDay}-${selectedTime}`).value;
                if(selectedMentor !== "Any") {
                    filters.push({selectedMentor, selectedDay, selectedTime});
                }
            }
        }

        const startTime = new Date().getTime();

        //get all of the possible shift (one mentor) for each block
        let mondayPossibilities = getDayShifts("Monday");
        mondayPossibilities = findLeastNoneShifts(mondayPossibilities);
        mondayPossibilities = applyCustomFilters(mondayPossibilities, "Monday", filters);
        mondayPossibilities = removeMaxHoursExceededDays(mondayPossibilities, maxShiftsNumber);


        let tuesdayPossibilities = getDayShifts("Tuesday");
        tuesdayPossibilities = findLeastNoneShifts(tuesdayPossibilities);
        tuesdayPossibilities = applyCustomFilters(tuesdayPossibilities, "Tuesday", filters);
        tuesdayPossibilities = removeMaxHoursExceededDays(tuesdayPossibilities, maxShiftsNumber);

        let wednesdayPossibilities = getDayShifts("Wednesday");
        wednesdayPossibilities = findLeastNoneShifts(wednesdayPossibilities);
        wednesdayPossibilities = applyCustomFilters(wednesdayPossibilities, "Wednesday", filters);
        wednesdayPossibilities = removeMaxHoursExceededDays(wednesdayPossibilities, maxShiftsNumber);

        let thursdayPossibilities = getDayShifts("Thursday");
        thursdayPossibilities = findLeastNoneShifts(thursdayPossibilities);
        thursdayPossibilities = applyCustomFilters(thursdayPossibilities, "Thursday", filters);
        thursdayPossibilities = removeMaxHoursExceededDays(thursdayPossibilities, maxShiftsNumber);

        let fridayPossibilities = getDayShifts("Friday");
        fridayPossibilities = findLeastNoneShifts(fridayPossibilities);
        fridayPossibilities = applyCustomFilters(fridayPossibilities, "Friday", filters);
        fridayPossibilities = removeMaxHoursExceededDays(fridayPossibilities, maxShiftsNumber);

        console.log(mondayPossibilities);
        console.log(tuesdayPossibilities);
        console.log(wednesdayPossibilities);
        console.log(thursdayPossibilities);
        console.log(fridayPossibilities);

        const expectedResultNumber = mondayPossibilities.length * tuesdayPossibilities.length * wednesdayPossibilities.length * thursdayPossibilities.length * fridayPossibilities.length;
        return;

        console.log(`Estimated number of results is ${expectedResultNumber}`)

        const schedules = [];

        //assuming there is only one mentor per shift, verify that nobody is working more than 4 shifts
        for (const mondayShift of mondayPossibilities) {
            let names: string[] = [];
            const mondayNames = Object.values(mondayShift).flatMap(arr => arr) as unknown as string[];
            names = names.concat(mondayNames);
            if (exceedHourLimit(names, maxShiftsNumber)) {
                continue;
            }
            for (const tuesdayShift of tuesdayPossibilities) {
                const tuesdayNames = Object.values(tuesdayShift).flatMap(arr => arr) as unknown as string[];
                names = names.concat(tuesdayNames);
                if (exceedHourLimit(names, maxShiftsNumber)) {
                    continue;
                }
                for (const wednesdayShift of wednesdayPossibilities) {
                    const wednesdayNames = Object.values(wednesdayShift).flatMap(arr => arr) as unknown as string[];
                    names = names.concat(wednesdayNames);
                    if (exceedHourLimit(names, maxShiftsNumber)) {
                        continue;
                    }

                    for (const thursdayShift of thursdayPossibilities) {
                        const thursdayNames = Object.values(thursdayShift).flatMap(arr => arr) as unknown as string[];
                        names = names.concat(thursdayNames);
                        if (exceedHourLimit(names, maxShiftsNumber)) {
                            continue;
                        }
                        for (const fridayShift of fridayPossibilities) {
                            const fridayNames = Object.values(fridayShift).flatMap(arr => arr) as unknown as string[];
                            names = names.concat(fridayNames);
                            if (exceedHourLimit(names, maxShiftsNumber)) {
                                continue;
                            }
                            const schedule = {
                                "Monday": mondayShift,
                                "Tuesday": tuesdayShift,
                                "Wednesday": wednesdayShift,
                                "Thursday": thursdayShift,
                                "Friday": fridayShift
                            };
                            schedules.push(schedule);
                        }
                    }
                }
            }
        }

        const elapsedSeconds = Math.floor((new Date().getTime() - startTime) / 1000);
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
        console.log("click");
    }

    //get all the shifts for a specific day
    function getDayShifts(specifiedDay: string) {
        if (savedMentors === undefined) {
            console.log("There was an error");
            return;
        }


        //all the mentors that are available some time on the specified day
        const allAvailableMentors = {
            "10": getAllTimeShifts(specifiedDay, 0),
            "11": getAllTimeShifts(specifiedDay, 1),
            "12": getAllTimeShifts(specifiedDay, 2),
            "1": getAllTimeShifts(specifiedDay, 3),
            "2": getAllTimeShifts(specifiedDay, 4),
            "3": getAllTimeShifts(specifiedDay, 5),
            "4": getAllTimeShifts(specifiedDay, 6),
            "5": getAllTimeShifts(specifiedDay, 7)
        };

        //all of the possible ways to configure a day (assumes having 0-1 mentors per shift)
        const allDayPossibilities = [];

        //todo refactor this so in the rare case this does happened, make it so this error is handled
        //this should not happened
        if (allAvailableMentors === undefined || Object.values(allAvailableMentors).some(v => v === undefined)) {
            console.log("a problem occurred")
            return false;
        }

        //! There has to be an easier way to do this
        for (const tenShift of allAvailableMentors["10"]) {
            for (const elevenShift of allAvailableMentors["11"]) {
                for (const twelveShift of allAvailableMentors["12"]) {
                    for (const oneShift of allAvailableMentors["1"]) {
                        for (const twoShift of allAvailableMentors["2"]) {
                            for (const threeShift of allAvailableMentors["3"]) {
                                for (const fourShift of allAvailableMentors["4"]) {
                                    for (const fiveShift of allAvailableMentors["5"]) {
                                        const day: Day = {
                                            '10': [tenShift],
                                            '11': [elevenShift],
                                            '12': [twelveShift],
                                            '1': [oneShift],
                                            '2': [twoShift],
                                            '3': [threeShift],
                                            '4': [fourShift],
                                            '5': [fiveShift],
                                        }
                                        allDayPossibilities.push(day);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return allDayPossibilities;
    }

    //get all the people who can work a specific shift on a specific day and time
    function getAllTimeShifts(specifiedDay: string, index: number) {
        if (savedMentors === undefined) {
            console.log("There was an error");
            return;
        }

        //automatically assume that nobody working the shift is an option
        const shifts = ["None"];

        //assume one mentor is working the shift
        savedMentors.forEach(m => {
            Object.keys(m.availability).forEach(day => {
                if (day == specifiedDay && m.availability[day][index]) { //the syntax is a lie
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

    function removeDuplicateStrings(arr: string[]) {
        return arr.filter((item: any,
            index: number) => arr.indexOf(item) === index);
    }

    function exceedHourLimit(people: string[], maxShiftsNumber: number) {
        //assumes there is only one mentor on shift
        const nonduplicatedPeople = removeDuplicateStrings(people).filter(name => name != "None");
        const peopleCount = nonduplicatedPeople.map(name => itemCounter(people, name));
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
        let filteredDays = [].concat(allDayShifts); //don't modify the original
        for (const filter of relevantFilters) {
            filteredDays = filteredDays.filter(day => day[filter.selectedTime].includes(filter.selectedMentor));
        }

        return filteredDays;
    }

    //remove any day possibilities in which the max hours were exceeded
    function removeMaxHoursExceededDays(allDayShifts: Day[], maxShiftsNumber: number) {
        const filteredDays = allDayShifts.filter(shift => {
            const names = Object.values(shift).flatMap(arr => arr) as unknown as string[];
            return !exceedHourLimit(names, maxShiftsNumber);
        });
        return filteredDays;
    }

    function getDropDown(id: string) {
        if(isLoading || savedMentors === undefined) {
            return "";
        }
        const day = id.split("-")[0];
        const time = id.split("-")[1];
        const timeIndex = ["10", "11", "12", "1", "2", "3", "4", "5"].indexOf(time);
        const validMentors = savedMentors.filter(mentor => mentor.availability[day][timeIndex]);
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
}

export default ViewSchedule;