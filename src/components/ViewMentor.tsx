"use client";
import { useState, useEffect } from "react";
import { MentorInterface } from "@/app/interface/Mentor";
import { Schedule } from "@/app/interface/Schedule";
import Mentor from "@/components/Mentor";
const ViewClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [savedMentors, setSavedMentors] = useState<MentorInterface[]>();
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

    //update mentors when one is deleted
    useEffect(() => {
        if (savedMentors !== undefined) {
          console.log('updating local storage');
          localStorage.setItem("mentors", JSON.stringify(savedMentors))
        }
      }, [savedMentors]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (savedMentors === undefined) {
        return <div>There was an error. Contact the developers</div>;
    }
    return (
        <div>
            <h2>Mentors</h2>
            <p>Saved mentors: {savedMentors.length}</p>
            {savedMentors.map(m => <Mentor mentor={m} savedMentors={savedMentors} setSavedMentors={setSavedMentors}></Mentor>)}
        </div>
    );
}

export default ViewClient;