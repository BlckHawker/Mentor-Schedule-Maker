"use client";
import Day from "@/components/Day";
import { useState, useEffect } from "react";
import Mentors from "@/json/Mentors.json";
const CreateMentor = () => {
  const [warningText, setWarningText] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const availability = {
    Monday: [false, false, false, false, false, false, false, false],
    Tuesday: [false, false, false, false, false, false, false, false],
    Wednesday: [false, false, false, false, false, false, false, false],
    Thursday: [false, false, false, false, false, false, false, false],
    Friday: [false, false, false, false, false, false, false, false],
  };
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      console.log(Mentors);
      //! get loading to work, so error checking can be done
    //   const response = await fetch("@/json/mentors.json");
    //   console.log(response);
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
      setWarningText("Invalid Availability: No schedules were given");
      return;
    }
    setWarningText(`Created new mentor: ${mentorName}`);
  }

  function mentorNameChange(e: React.FormEvent<HTMLInputElement>) {
    setMentorName(e.currentTarget.value);
  }
};

export default CreateMentor;
