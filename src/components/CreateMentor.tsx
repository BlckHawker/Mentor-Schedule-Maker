"use client";
import Day from "@/components/Day";
import { useState } from "react";
const CreateMentor = () => {
  const [warningText, setWarningText] = useState("");
  const [mentorName, setMentorName] = useState("");
  const availability = {
    Monday: [false, false, false, false, false, false, false, false],
    Tuesday: [false, false, false, false, false, false, false, false],
    Wednesday: [false, false, false, false, false, false, false, false],
    Thursday: [false, false, false, false, false, false, false, false],
    Friday: [false, false, false, false, false, false, false, false],
  };
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
    if(mentorName === "") {
        setWarningText('Mentor name is required');
        return;
    }
    //if availability is complexly blank, invalid
    if(Object.values(availability).flatMap(b => b).every(b => b === false)) {
        setWarningText('Invalid Availability: No schedules were given');
        return;
    }
    setWarningText(`Created new mentor: ${mentorName}`);
  }

  function mentorNameChange(e: React.FormEvent<HTMLInputElement>) {
    setMentorName(e.currentTarget.value)
  }
};

export default CreateMentor;
