"use client";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Schedule } from "@/app/interface/Schedule";
import { Color } from "@/app/interface/Color";
import ScheduleManager from "./ScheduleManager";
import { FilterInterface } from "@/app/interface/Filter";
import { Day } from "@/app/interface/Day";
import { ViewSchedulesFilter } from "@/app/interface/ViewSchedulesFilter";


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["10", "11", "12", "1", "2", "3", "4", "5"];
const ViewSchedules = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hideFilters, setHideFilters] = useState(false)
    const [savedSchedules, setSavedSchedules] = useState<Schedule[]>();
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>();
    const [savedMentorNames, setSavedMentorNames] = useState<string[]>([]);
    const [colorDictionary, setColorDictionary] = useState<Color[]>();
    //load data
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const localStorageSchedules = loadArrFromLocalStorage("schedules");
            const localStorageMentors = loadArrFromLocalStorage("mentors");
            const mentorsNames = Object.values(localStorageMentors).map((mentor: any) => mentor.name);
            const newColorDictionary = [];
            const colors = generateColorsArray();
            const darkColors = ["#0000FF", "#800080", "#800000", "#800000", "#B22222", "#6A5ACD", "#000080", "#808080", "#8A2BE2", "#008080", "#4682B4", "#008000", "#A0522D"]

            for (let i = 0; i < mentorsNames.length; i++) {
                newColorDictionary.push({ name: mentorsNames[i], color: colors[i], dark: darkColors.includes(colors[i]) });
            }

            setSavedMentorNames(mentorsNames);
            setSavedSchedules(localStorageSchedules);
            setFilteredSchedules(localStorageSchedules);
            setColorDictionary(newColorDictionary);
            setIsLoading(false);
        }
        fetchData();
    }, []);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <NavBar />
            {savedSchedules &&
                <p>{savedSchedules.length === 0 ? "No schedules saved in local storage" : `${savedSchedules.length} schedules found (${filteredSchedules?.length} with filters)`}</p>}


            {filteredSchedules &&
                <div>

                    <h2>Filters</h2>
                    <div>
                        <input type="checkbox" checked={hideFilters} onChange={e => { setHideFilters(e.target.checked); }} />
                        <label>Hide Filters</label>
                    </div>

                    {!hideFilters &&
                        <div>
                            <button onClick={() => removeAllFilters(savedSchedules as Schedule[], setFilteredSchedules)}>Remove all filters</button>
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
                                                    {getDropDown(`${day}-${time}`, savedSchedules as Schedule[], setFilteredSchedules)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }

                    <ScheduleManager savedSchedules={filteredSchedules} mentorNames={savedMentorNames} colorDictionary={colorDictionary as Color[]} days={days as (keyof Schedule)[]} times={times as (keyof Day)[]} />
                </div>}
        </div>
    )
}

function loadArrFromLocalStorage(variableName: string) {
    let str = localStorage.getItem(variableName);
    if (str === "undefined" || str === null) {
        str = "[]";
    }

    return JSON.parse(str);
}

function getDropDown(id: string, schedules: Schedule[], setFilteredSchedules: any) {
    const day = id.split("-")[0];
    const time = id.split("-")[1];

    //get all the people who work that time on that day
    const allNames = schedules.flatMap(schedule => schedule[day as (keyof Schedule)][time as (keyof Day)])
    const names = allNames.filter((name, pos) => {
        return allNames.indexOf(name) == pos;
    }).sort()

    let onlyName = null;
    if (names.length == 1) {
        onlyName = names[0];
    }

    names.splice(0, 0, "Any");
    return <select disabled={onlyName !== null} id={id} onChange={() => { changeFilteredSchedules(schedules, setFilteredSchedules) }}>
        {names.map(name => (
            <option key={name} selected={name === onlyName} value={name}>
                {name}
            </option>
        ))}
    </select>

}

function generateColorsArray() {

    //todo: combine this so colors replaces the numbers array
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#C0C0C0", "#808080", "#FFA07A", "#F08080", "#E0FFFF", "#90EE90", "#D3D3D3", "#FFB6C1", "#FF69B4", "#FFD700", "#FF6347", "#40E0D0", "#E6E6FA", "#FFFACD", "#ADD8E6", "#F0E68C", "#E6B0AA", "#FF1493", "#DB7093", "#FF4500", "#DA70D6", "#FF8C00", "#B0C4DE", "#4682B4", "#D2B48C", "#F5DEB3", "#C1FFC1", "#FFDF00", "#B22222", "#32CD32", "#FF6347", "#FF7F50", "#D2691E", "#FF00FF", "#00FF7F", "#7FFF00", "#6A5ACD", "#FFD700", "#F4A460", "#FF4500", "#FF1493", "#00FA9A", "#1E90FF", "#FFB6C1", "#D8BFD8", "#D3D3D3", "#B0E0E6", "#F08080", "#E9967A", "#DAA520", "#B8860B", "#C0C0C0", "#FF6347", "#32CD32", "#FF4500", "#D2691E", "#F5FFFA", "#F0E68C", "#D2B48C", "#F5DEB3", "#B0C4DE", "#E6E6FA", "#E0FFFF", "#F0F8FF", "#B0E0E6", "#FFE4E1", "#FFE4B5", "#FFDAB9", "#FFE4C4", "#F4A460", "#FA8072", "#FF69B4", "#DB7093", "#FF1493", "#C71585", "#F5DEB3", "#FAEBD7", "#FFF5EE", "#F0F0F0", "#F5F5F5", "#FFE4E1", "#FFF8DC", "#F0FFF0", "#F5FFFA", "#F0FFFF", "#E6E6FA", "#D8BFD8", "#E0FFFF", "#F0E68C", "#E6B0AA", "#FFB6C1", "#FF6347", "#F08080", "#FFD700", "#B0C4DE", "#6A5ACD", "#8A2BE2", "#A0522D", "#5F9FFF", "#D2691E", "#FF7F50", "#FF6347", "#DA70D6", "#FF4500"];
    // Create an array with numbers from 0 to 119
    const numbers = Array.from({ length: 120 }, (_, index) => index);

    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap elements
    }

    //return the colors in a random order
    return numbers.map(num => colors[num]);
}

function changeFilteredSchedules(schedules: Schedule[], setFilteredSchedules: any) {
    //get new filters
    const filters: ViewSchedulesFilter[] = [];

    for (const selectedDay of days) {
        for (const selectedTime of times) {
            const selectedMentor = (document.querySelector(`#${selectedDay}-${selectedTime}`) as HTMLInputElement).value;
            if (selectedMentor !== "Any") {
                filters.push({ mentor: selectedMentor, day: selectedDay, time: selectedTime });
            }
        }
    }

    applyCustomFilters(filters, schedules, setFilteredSchedules);
}

function applyCustomFilters(filters: ViewSchedulesFilter[], schedules: Schedule[], setFilteredSchedules: any) {
    let newSchedules = [...schedules];

    //for each filter, get rid of any schedules that don't follow it
    for (const filter of filters) {
        newSchedules = newSchedules.filter(schedule => schedule[filter.day as keyof Schedule][filter.time as keyof Day].includes(filter.mentor))
    }
    setFilteredSchedules(newSchedules);
}

function removeAllFilters(schedules: Schedule[], setFilteredSchedules: any) {
    //set all dropdowns (that are not disabled) to be any
    for (const selectedDay of days) {
        for (const selectedTime of times) {
            const dropdown = document.querySelector(`#${selectedDay}-${selectedTime}`) as HTMLInputElement;
            if (!dropdown.disabled) {
                dropdown.value = "Any";
            }
        }
    }

    changeFilteredSchedules(schedules, setFilteredSchedules)

}

export default ViewSchedules;