"use client";
import { useState, useEffect } from "react";
import { MentorInterface } from "@/app/interface/Mentor";
import { Schedule } from "@/app/interface/Schedule";
import Mentor from "@/components/Mentor";
const ViewClient = () => {
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
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (savedMentors === undefined) {
        return <div>There was an error. Contact the developers</div>;
    }
    return (
        <div>
            <h2>Mentors</h2>
            {savedMentors.map(m => <Mentor name={m.name} availability={m.availability}></Mentor>)}
        </div>
    );
}

export default ViewClient;