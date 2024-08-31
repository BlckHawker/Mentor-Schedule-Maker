"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { Day } from "@/app/interface/Day"
import { useState, useEffect } from "react";
import IndividualSchedule from "./IndividualSchedule";

const ViewSchedule = () => {
    const maxShifts = 4;
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
    const [isLoading, setIsLoading] = useState(false);
    const [savedMentors, setSavedMentors] = useState<MentorInterface[]>();
    const [possibleSchedules, setPossibleSchedules] = useState<Schedule[]>();
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
            <button onClick={() => pressStopwatchButton()}>Stopwatch</button>
            <button onClick={() => generateSchedules()}>Generate schedules</button>
            {possibleSchedules?.filter((_, ix) => ix === 100).map(schedule => <IndividualSchedule {...schedule}></IndividualSchedule>)}
        </div>
    );

    function generateSchedules() {
        if (savedMentors === undefined) {
            console.log("There was an error");
            return;
        }

        const startTime = new Date().getTime();


        //get all of the possible shift (one mentor) for each block
        let mondayPossibilities = getDayShifts("Monday");
        const fullMondayShifts = getFullDayShifts(mondayPossibilities);
        if (fullMondayShifts.length !== 0) {
            mondayPossibilities = fullMondayShifts;
        }

        let tuesdayPossibilities = getDayShifts("Tuesday");
        const fullTuesdayShifts = getFullDayShifts(tuesdayPossibilities);
        if (fullTuesdayShifts.length !== 0) {
            tuesdayPossibilities = fullTuesdayShifts;
        }

        let wednesdayPossibilities = getDayShifts("Wednesday");
        const fullWednesdayShifts = getFullDayShifts(wednesdayPossibilities);
        if (fullWednesdayShifts.length !== 0) {
            wednesdayPossibilities = fullWednesdayShifts;
        }

        let thursdayPossibilities = getDayShifts("Thursday");
        const fullThursdayShifts = getFullDayShifts(thursdayPossibilities);
        if (fullThursdayShifts.length !== 0) {
            thursdayPossibilities = fullThursdayShifts;
        }

        let fridayPossibilities = getDayShifts("Friday");
        console.log(fridayPossibilities);
        const fullFridayShifts = getFullDayShifts(fridayPossibilities);
        if (fullFridayShifts.length !== 0) {
            fridayPossibilities = fullFridayShifts;
        }


        console.log(mondayPossibilities);
        console.log(tuesdayPossibilities);
        console.log(wednesdayPossibilities);
        console.log(thursdayPossibilities);
        console.log(fridayPossibilities);



        const expectedResultNumber = mondayPossibilities.length * tuesdayPossibilities.length * wednesdayPossibilities.length * thursdayPossibilities.length * fridayPossibilities.length;

        console.log(`Expecting ${expectedResultNumber} results`)
        //the syntax is a lie
        const schedules = [];
        for (let monday = 0; monday < mondayPossibilities.length; monday++) {
            const mondayNames = Object.values(mondayPossibilities[monday]).flatMap(arr => arr) as unknown as string[];
            if (exceedHourLimit(mondayNames)) {
                continue;
            }
            //assuming there is only one mentor per shift, verify that nobody is working more than 4 shifts
            for (let tuesday = 0; tuesday < tuesdayPossibilities.length; tuesday++) {
                const tuesdayNames = Object.values(tuesdayPossibilities[tuesday]).flatMap(arr => arr) as unknown as string[];
                if (exceedHourLimit(mondayNames.concat(tuesdayNames))) {
                    continue;
                }
                for (let wednesday = 0; wednesday < wednesdayPossibilities.length; wednesday++) {
                    const wednesdayNames = Object.values(wednesdayPossibilities[wednesday]).flatMap(arr => arr) as unknown as string[];
                    if (exceedHourLimit(mondayNames.concat(tuesdayNames).concat(wednesdayNames))) {
                        continue;
                    }

                    for (let thursday = 0; thursday < thursdayPossibilities.length; thursday++) {
                        const thursdayNames = Object.values(thursdayPossibilities[thursday]).flatMap(arr => arr) as unknown as string[];
                        if (exceedHourLimit(mondayNames.concat(tuesdayNames).concat(wednesdayNames).concat(thursdayNames))) {
                            continue;
                        }

                        for (let friday = 0; friday < fridayPossibilities.length; friday++) {
                            const fridayNames = Object.values(fridayPossibilities[friday]).flatMap(arr => arr) as unknown as string[];
                            if (exceedHourLimit(mondayNames.concat(tuesdayNames).concat(wednesdayNames).concat(thursdayNames).concat(fridayNames))) {
                                continue;
                            }

                            const schedule = {
                                "Monday": mondayPossibilities[monday],
                                "Tuesday": tuesdayPossibilities[tuesday],
                                "Wednesday": wednesdayPossibilities[wednesday],
                                "Thursday": thursdayPossibilities[thursday],
                                "Friday": fridayPossibilities[friday]
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
        console.log(schedules);
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
        for (let ten = 0; ten < allAvailableMentors["10"].length; ten++) {
            for (let eleven = 0; eleven < allAvailableMentors["11"].length; eleven++) {
                for (let twelve = 0; twelve < allAvailableMentors["12"].length; twelve++) {
                    for (let one = 0; one < allAvailableMentors["1"].length; one++) {
                        for (let two = 0; two < allAvailableMentors["2"].length; two++) {
                            for (let three = 0; three < allAvailableMentors["3"].length; three++) {
                                for (let four = 0; four < allAvailableMentors["4"].length; four++) {
                                    for (let five = 0; five < allAvailableMentors["5"].length; five++) {
                                        const day: Day = {
                                            '10': [allAvailableMentors["10"][ten]],
                                            '11': [allAvailableMentors["11"][eleven]],
                                            '12': [allAvailableMentors["12"][twelve]],
                                            '1': [allAvailableMentors["1"][one]],
                                            '2': [allAvailableMentors["2"][two]],
                                            '3': [allAvailableMentors["3"][three]],
                                            '4': [allAvailableMentors["4"][four]],
                                            '5': [allAvailableMentors["5"][five]],
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

        if(specifiedDay === "Friday") {
            console.log("Friday", allDayPossibilities);
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

    //returns an array of a day's schedule where every shift if filled (no "Nones")
    function getFullDayShifts(allDayShifts: Day[]) {
        //assumes that there is one only one mentor on each shift
        const filteredShifts = allDayShifts.filter((possibility: Day) => {
            const names = Object.values(possibility).map(arr => arr[0]);
            return !names.includes("None");
        });

        return filteredShifts;

    }

    //Tells how many times each name has occurred in an array
    //assumes there's only one person in the list
    function itemCounter(arr: string[], value: string) {
        return arr.filter((x) => x === value).length;
    };

    function removeDuplicates(arr: string[]) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    function exceedHourLimit(people: string[], log: boolean = false) {
        //assumes there is only one mentor on shift
        const nonduplicatedPeople = removeDuplicates(people);
        const peopleCount = nonduplicatedPeople.map(name => itemCounter(people, name));
        if (log) {
            console.log(people);
            console.log(nonduplicatedPeople);
            console.log(peopleCount);
            console.log(peopleCount.some(num => num > maxShifts));
        }
        return peopleCount.some(num => num > maxShifts);
    }

    function pressStopwatchButton() {
        if (!startStopwatch) {
            console.log("starting stopwatch");
            startTime = new Date().getTime(); // get the starting time by subtracting the elapsed paused time from the current time
        }

        else {
            console.log("ending stopwatch");
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

        }

        startStopwatch = !startStopwatch;
    }
}

export default ViewSchedule;