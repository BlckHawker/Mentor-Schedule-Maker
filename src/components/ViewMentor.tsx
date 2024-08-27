"use client";
import { useState, useEffect } from "react";
import Mentor from "@/components/Mentor";
const ViewClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [savedMentors, setSavedMentors] = useState<{ name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[]>();
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let str = localStorage.getItem("mentors");
            if (str === "undefined" || str === null) {
                str = "[]";
            }
            const localStorageMentors = JSON.parse(str);
            console.log(localStorageMentors);
            setSavedMentors(localStorageMentors);
            setIsLoading(false);
        }
        fetchData();
    }, []);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if(savedMentors === undefined) {
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