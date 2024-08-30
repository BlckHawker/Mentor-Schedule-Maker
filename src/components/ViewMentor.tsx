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
            <button onClick={() => generateSchedules()}>Generate schedules</button>
            {savedMentors.map(m => <Mentor name={m.name} availability={m.availability}></Mentor>)}
        </div>
    );

    function generateSchedules() 
    {
        if(savedMentors === undefined) {
            console.log("There was an error");
            return;
        }
        //10am - 11am on Monday
        //get all of the possible shift (one mentor)

        //! This is terrible
        const tenToElevenMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;

        savedMentors.forEach(m => {
            if(m.availability.Monday[0])
                tenToElevenMonday.push(m);
            
        });

        console.log(tenToElevenMonday);

        
    }
}

export default ViewClient;