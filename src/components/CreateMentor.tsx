"use client";
import Day from "@/components/Day";
import { useState, useEffect } from "react";
const CreateMentor = () => {
  const [warningText, setWarningText] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedMentors, setSavedMentors] = useState<{ name: string; availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; }; }[]>();
  const availability = {
    "Monday": [false, false, false, false, false, false, false, false],
    "Tuesday": [false, false, false, false, false, false, false, false],
    "Wednesday": [false, false, false, false, false, false, false, false],
    "Thursday": [false, false, false, false, false, false, false, false],
    "Friday": [false, false, false, false, false, false, false, false],
  };
  useEffect(() => {
    console.log(savedMentors)
    if(savedMentors !== undefined) {
      console.log('updating local storage')
      localStorage.setItem("mentors", JSON.stringify(savedMentors))
    }
  }, [savedMentors]);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      let str = localStorage.getItem("mentors");
      if(str === "undefined" || str === null) {
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
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
      <label>Mentor Name: </label>
      <input type="text" onChange={mentorNameChange}></input>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Day day="Monday" availability={availability["Monday"]}></Day>
        <Day day="Tuesday" availability={availability["Tuesday"]}></Day>
        <Day day="Wednesday" availability={availability["Wednesday"]}></Day>
        <Day day="Thursday" availability={availability["Thursday"]}></Day>
        <Day day="Friday" availability={availability["Friday"]}></Day>
      </div>
      <button onClick={() => buttonClick()}>Submit</button>
      <p style={{ color: "red" }}>{warningText}</p>
    </div>
  );

  function buttonClick() {
    //if name is blank, invalid
    if (mentorName === "") {
      setWarningText("Mentor name is required");
      return;
    }
    //if availability is complexly blank, invalid
    if (
      Object.values(availability)
        .flatMap((b) => b)
        .every((b) => b === false)
    ) {
      //! this line is being reached even though there are buttons that are green. This may be bc of the the way isActive is being set in Block.tsx
      setWarningText("A mentor cannot have blank availability");
      return;
    }

    //this should never happen
    if(savedMentors === undefined) {
      setWarningText("Something went wrong. Contact the developers.");
      return;
    }

    //verify a mentor with that name doesn't exist
    if(savedMentors.find(m => m.name === mentorName) !== undefined) {
      setWarningText(`A mentor with the name "${mentorName}" already exists`);
      return;
    }
    //add new mentor to the list
    setSavedMentors( // Replace the state
      [ // with a new array
        ...savedMentors, // that contains all the old items
        { name: mentorName, availability } // and one new item at the end
      ]
    );
    setWarningText(`Created new mentor: ${mentorName}`); //! this should be changed to not show as a warning

    
  }

  function mentorNameChange(e: React.FormEvent<HTMLInputElement>) {
    setMentorName(e.currentTarget.value);
  }
};

export default CreateMentor;
