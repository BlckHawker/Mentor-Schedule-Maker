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
        //
        //get all of the possible shift (one mentor) for each block

        //! This is terrible and boilerplaty (should refactor asap)
        const tenToElevenMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][0])
                tenToElevenMonday.push(m);
        });

        const elevenToTwelveMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][1])
                elevenToTwelveMonday.push(m);
        });

        const twelveToOneMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][2])
                twelveToOneMonday.push(m);
        });

        const oneToTwoMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][3])
                oneToTwoMonday.push(m);
        });

        const twoToThreeMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][4])
                twoToThreeMonday.push(m);
        });

        const threeToFourMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][5])
                threeToFourMonday.push(m);
        });

        const fourToFiveMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][5])
                fourToFiveMonday.push(m);
        });

        const fiveToSixMonday: { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[] = [[] as unknown as { name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; } ] ;
        savedMentors.forEach(m => {
            if(m.availability["Monday"][6])
                fiveToSixMonday.push(m);
        });

        console.log("10am - 11am", tenToElevenMonday.map(m => [m.name]));
        console.log("11am - 12pm", elevenToTwelveMonday.map(m => [m.name]));
        console.log("12pm - 1pm", twelveToOneMonday.map(m => [m.name]));
        console.log("1pm - 2pm", oneToTwoMonday.map(m => [m.name]));
        console.log("2pm - 3pm", twoToThreeMonday.map(m => [m.name]));
        console.log("3pm - 4pm", threeToFourMonday.map(m => [m.name]));
        console.log("4pm - 5pm", fourToFiveMonday.map(m => [m.name]));
        console.log("5pm - 6pm", fiveToSixMonday.map(m => [m.name]));
    }
}

export default ViewClient;