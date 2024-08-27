"use client";
import Day from "@/components/Day";
import { useState } from "react";
const CreateMentor = () => {
  const [warningText, setWarningText] = useState("");
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
      <input type="text"></input>
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
    //if availability is complexly blank, say it's invalid
    if(Object.values(availability).flatMap(b => b).every(b => b === false)) {
        setWarningText('Invalid Availability: No schedules were given');
        return;
    }

    setWarningText('Schedule is good');


  }
};

export default CreateMentor;
