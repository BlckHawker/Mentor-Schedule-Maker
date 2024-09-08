"use client";
import { MentorInterface } from "@/app/interface/Mentor";
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
    if (savedMentors !== undefined) {
      console.log('updating local storage');
      localStorage.setItem("mentors", JSON.stringify(savedMentors))
    }
  }, [savedMentors]);
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
      <button onClick={() => populateMentors()}>Populate Mentors (Debug)</button>
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
    if (savedMentors === undefined) {
      setWarningText("Something went wrong. Contact the developers.");
      return;
    }

    //verify a mentor with that name doesn't exist
    if (savedMentors.find(m => m.name === mentorName) !== undefined) {
      setWarningText(`A mentor with the name "${mentorName}" already exists`);
      return;
    }

    //todo sort mentors

    const newMentors = [ ...savedMentors, { name: mentorName, availability } ].sort(sortMentors);

    //add new mentor to the list
    setSavedMentors(newMentors);
    setWarningText(`Created new mentor: ${mentorName}`); //! this should be changed to not show as a warning
  }

  //Debug method that populates the mentor with dummy data
  function populateMentors() {
    let mentors = [];

    mentors.push({
      name: "Brooklyn Furze", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, true, true],
        "Tuesday": [false, false, false, false, false, false, true, true],
        "Wednesday": [false, false, false, false, false, false, true, true],
        "Thursday": [false, false, false, true, true, true, true, true],
        "Friday": [false, false, false, false, false, false, true, true],
      }
    });
    mentors.push({
      name: "Abigail Cawley", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [false, false, true, false, false, false, false, true],
        "Tuesday": [false, false, false, false, false, false, false, true],
        "Wednesday": [false, false, true, false, false, false, false, true],
        "Thursday": [false, false, false, false, false, false, false, true],
        "Friday": [false, false, true, false, false, true, true, true],
      }
    });

    
    mentors.push({
      name: "Ethan Ricker", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [false, false, true, true, true, true, true, true],
        "Tuesday": [false, false, false, false, false, true, false, false],
        "Wednesday": [false, false, true, true, true, false, false, false],
        "Thursday": [false, false, false, false, false, true, false, false],
        "Friday": [false, false, true, true, true, true, false, false],
      }
    });


    mentors.push({
      name: "Jonah Edick", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [true, false, true, false, false, false, false, false],
        "Tuesday": [false, false, false, false, false, true, true, false],
        "Wednesday": [true, false, true, false, true, true, true, true],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [true, false, true, false, true, true, true, true],
      }
    });

    mentors.push({
      name: "Andrew Lee", availability: {
        //10   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, false, false],
        "Tuesday": [false, false, true, false, false, false, true, true],
        "Wednesday": [false, false, false, false, false, false, false, false],
        "Thursday": [false, false, false, true, false, false, false, false],
        "Friday": [false, false, false, false, false, false, false, false],
      }
    });

    mentors.push({
      name: "Aneesh Bukya", availability: {
        //10   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, true, true],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [false, false, false, false, false, false, true, true],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [false, false, false, false, false, false, false, false],
      }
    });

    mentors.push({
      name: "Anthony", availability: {
                    //10   11    12      1      2      3      4     5
        "Monday": [false, false, false, true, false, false, false, false],
        "Tuesday": [false, false, false, false, true, false, false, false],
        "Wednesday": [false, false, false, true, false, false, false, false],
        "Thursday": [false, false, false, false, true, false, false, false],
        "Friday": [false, false, false, false, true, false, true, false],
      }
    });

    mentors.push({
      name: "Cooper Mistishin", availability: {
        //10   11    12      1      2      3      4     5
        "Monday": [true, true, false, false, true, true, true, true],
        "Tuesday": [true, true, false, false, false, false, false, false],
        "Wednesday": [true, true, false, false, true, true, true, true],
        "Thursday": [true, true, false, false, false, false, false, false],
        "Friday": [true, true, false, false, true, true, true, true],
      }
    });

    mentors.push({
      name: "Evan Kinsey", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [true, false, false, false, true, true, false, false],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [true, false, false, false, true, true, false, false],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [true, false, false, false, true, true, false, false],
      }
    });

    mentors.push({
      name: "Hridiza", availability: {
                  //10   11    12      1      2      3      4     5
      "Monday": [false, false, false, true, false, false, false, false],
      "Tuesday": [false, false, false, false, false, false, false, false],
      "Wednesday": [false, false, false, false, false, false, false, false],
      "Thursday": [false, false, false, false, false, false, false, false],
      "Friday": [false, false, false, true, false, false, false, false],
      }
    });

    mentors.push({
      name: "Max", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [true, true, true, true, false, false, false, false],
        "Tuesday": [true, false, false, false, false, false, false, false],
        "Wednesday": [true, true, true, true, false, false, false, false],
        "Thursday": [true, false, false, false, false, false, false, false],
        "Friday": [true, true, true, true, false, false, false, false],
      }
    });

    mentors.push({
      name: "Ryan Yocum", availability: {
                    //10   11    12      1      2      3      4     5
        "Monday": [true, false, false, true, true, false, false, false],
        "Tuesday": [false, false, false, false, true, true, false, false],
        "Wednesday": [true, false, false, true, true, false, false, false],
        "Thursday": [false, false, false, false, true, true, false, false],
        "Friday": [true, false, false, true, true, false, false, false],
      }
    });

    mentors.push({
      name: "Sylvia", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, true, true],
        "Tuesday": [false, false, true, true, true, true, false, false],
        "Wednesday": [false, false, false, false, false, false, true, true],
        "Thursday": [false, false, true, true, true, true, false, false],
        "Friday": [false, false, false, false, false, false, true, true],
      }
    });

    mentors.push({
      name: "Tristen", availability: {
                  //10   11    12      1      2      3      4     5
        "Monday": [false, false, true, true, true, false, false, false],
        "Tuesday": [true, true, false, false, false, false, false, true],
        "Wednesday": [false, false, true, true, true, false, false, false],
        "Thursday": [true, true, false, false, false, false, false, true],
        "Friday": [true, false, true, true, true, false, false, false],
      }
    });

    mentors = mentors.sort(sortMentors);
    setSavedMentors(mentors);

    setWarningText(`Added debug schedules for ${mentors.map(m => m.name).join(", ")}. (${mentors.length})`);



  }

  function mentorNameChange(e: React.FormEvent<HTMLInputElement>) {
    setMentorName(e.currentTarget.value);
  }

  function sortMentors(m1: MentorInterface, m2: MentorInterface) {
    return m1.name.localeCompare(m2.name);
  }
};

export default CreateMentor;
