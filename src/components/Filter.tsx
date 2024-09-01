"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";

interface Props {
    mentors: MentorInterface[];
    onFilterChange?: (filterData: { selectedMentor: string, selectedDay: string, selectedTime: string }) => void;
}

const Filter = ({ mentors, onFilterChange }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [selectedTime, setSelectedTime] = useState("10");

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            if (mentors.length !== 0) {
                setSelectedMentor(mentors[0].name);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [mentors]);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({ selectedMentor, selectedDay, selectedTime });
        }
    }, [selectedMentor, selectedDay, selectedTime]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
            <li>
                Force
                <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                    {mentors.map(mentor => (
                        <option key={mentor.name} value={mentor.name}>
                            {mentor.name}
                        </option>
                    ))}
                </select>
                on
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
                at
                <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                    {["10", "11", "12", "1", "2", "3", "4", "5"].map(time => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </li>
    );
}

export default Filter;
