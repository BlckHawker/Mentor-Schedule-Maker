"use client";
import { Schedule } from "@/app/interface/Schedule";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import IndividualSchedule from "./IndividualSchedule";

const ViewSchedule = () => {
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
            <button onClick={() => generateSchedules()}>Generate schedules</button>
            {possibleSchedules?.filter((_, ix) => ix === 49000).map(schedule => <IndividualSchedule {...schedule}></IndividualSchedule>)}
        </div>
    );

    function generateSchedules() {
        if (savedMentors === undefined) {
            console.log("There was an error");
            return;
        }

        //get all of the possible shift (one mentor) for each block
        const mondayPossibilities = getDayShift("Monday");

        //this syntax is also a lie
        const schedules = mondayPossibilities?.map((possibility: string[]) => ({
            "Monday": possibility,
            "Tuesday": {
                "10": [],
                "11": [],
                "12": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": []
            },
            "Wednesday": {
                "10": [],
                "11": [],
                "12": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": []
            },
            "Thursday": {
                "10": [],
                "11": [],
                "12": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": []
            },
            "Friday": {
                "10": [],
                "11": [],
                "12": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": []
            }
        }));
        
        console.log(schedules);
        setPossibleSchedules(schedules);
        console.log("click");
    }

    //get all the shifts for a specific day
    function getDayShift(specifiedDay: string) {
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

        console.log(allAvailableMentors);

        //all of the possible ways to configure a day (assumes having 0-1 mentors per shift)
        const allDayPossibilities = [];

        //todo refactor this so in the rare case this does happened, make it so this error is handled
        //this should not happened
        if (allAvailableMentors === undefined || Object.values(allAvailableMentors).some(v => v === undefined)) {
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
                                        const obj = {
                                            '10': [allAvailableMentors["10"][ten]],
                                            '11': [allAvailableMentors["11"][eleven]],
                                            '12': [allAvailableMentors["12"][twelve]],
                                            '1': [allAvailableMentors["1"][one]],
                                            '2': [allAvailableMentors["2"][two]],
                                            '3': [allAvailableMentors["3"][three]],
                                            '4': [allAvailableMentors["4"][four]],
                                            '5': [allAvailableMentors["5"][five]],
                                        }
                                        console.log(Object.values(obj).map(name => name).join(", "));
                                        allDayPossibilities.push(obj);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //update the list of possible schedules
        console.log(allDayPossibilities);


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
}

export default ViewSchedule;