"use client";
import { Availability } from "@/app/interface/Availability";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import Block from "@/components/Block";
const CreateMentor = () => {

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const times = ["10", "11", "12", "1", "2", "3", "4", "5"]

  const blankAvailability = {
    "Monday": [false, false, false, false, false, false, false, false],
    "Tuesday": [false, false, false, false, false, false, false, false],
    "Wednesday": [false, false, false, false, false, false, false, false],
    "Thursday": [false, false, false, false, false, false, false, false],
    "Friday": [false, false, false, false, false, false, false, false],
  }

  const [warningText, setWarningText] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedMentors, setSavedMentors] = useState<{ name: string; availability: Availability }[]>();
  const [availability, setAvailability] = useState<Availability>(blankAvailability);


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
    <div>
      <label>Mentor Name (first and last): </label>
      <input type="text" onChange={mentorNameChange}></input>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              {days.map(day => <th>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {times.map((time, ix) => (
              <tr key={time}>
                <td>{time}</td>
                {days.map(day => <td><Block day={day as keyof Availability} index={ix} availability={availability} setAvailability={setAvailability} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => createMentor()}>Submit</button>
      <button onClick={() => populateMentors()}>Populate Mentors (Debug)</button>
      <button onClick={() => setAvailability(blankAvailability)}>Reset Schedule</button>
      <p style={{ color: "red" }}>{warningText}</p>
    </div>
  );

  function createMentor() {
    //if name is blank, invalid
    if (mentorName === "") {
      setWarningText("Mentor name is required");
      return;
    }

    // "None" is a forbidden name
    if (mentorName === "None") {
      setWarningText("\"None\" is a forbidden name");
      return;
    }

    //verify there is a first / last name
    if (mentorName.split(" ").length === 1) {
      setWarningText("Mentor name must have first and last name");
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

    let newMentors;

    const mentorExists = savedMentors.find(m => m.name === mentorName);

    //if a mentor with that same name pops up, update their availability
    if (mentorExists) {
      newMentors = [...savedMentors].filter(m => m.name !== mentorName);

    }

    const populatedAvailability = mentorExists ?  newMentors : savedMentors;

    //This should never be false happen but is just a safety to get rid of the typescript error
    if (populatedAvailability) {
      newMentors = [...populatedAvailability, { name: mentorName, availability }];
    } 
    
    else {
        newMentors = [{ name: mentorName, availability }];
    }

    //sort mentors by their first name
    newMentors = newMentors.sort(sortMentors);

    //add new mentor to the list
    setSavedMentors(newMentors);

    const text = mentorExists ? `Updated ${mentorName}'s availability` : `Created new mentor: ${mentorName}`
    setWarningText(text);
  }

  //Debug method that populates the mentor with dummy data
  function populateMentors() {
    let mentors = [];

    mentors.push({
      name: "Brooklyn Furze", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, true, true],
        "Tuesday": [false, false, false, false, false, false, true, true],
        "Wednesday": [false, false, false, false, false, false, true, true],
        "Thursday": [false, false, false, true, true, true, true, true],
        "Friday": [false, false, false, false, false, false, true, true],
      }
    });
    mentors.push({
      name: "Abigail Cawley", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, true, false, false, false, false, true],
        "Tuesday": [false, false, false, false, false, false, false, true],
        "Wednesday": [false, false, true, false, false, false, false, true],
        "Thursday": [false, false, false, false, false, false, false, true],
        "Friday": [false, false, true, false, false, true, true, true],
      }
    });


    mentors.push({
      name: "Ethan Ricker", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, true, true, true, true, true, true],
        "Tuesday": [false, false, false, false, false, true, false, false],
        "Wednesday": [false, false, true, true, true, false, false, false],
        "Thursday": [false, false, false, false, false, true, false, false],
        "Friday": [false, false, true, true, true, true, false, false],
      }
    });


    mentors.push({
      name: "Jonah Edick", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [true, false, true, false, false, false, false, false],
        "Tuesday": [false, false, false, false, false, true, true, false],
        "Wednesday": [true, false, true, false, true, true, true, true],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [true, false, true, false, true, true, true, true],
      }
    });

    mentors.push({
      name: "Andrew Lee", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, false, false],
        "Tuesday": [false, false, true, false, false, false, true, true],
        "Wednesday": [false, false, false, false, false, false, false, false],
        "Thursday": [false, false, false, true, false, false, false, false],
        "Friday": [false, false, false, false, false, false, false, false],
      }
    });

    mentors.push({
      name: "Aneesh Bukya", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, true, true],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [false, false, false, false, false, false, true, true],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [false, false, false, false, false, false, false, false],
      }
    });

    mentors.push({
      name: "Anthony", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, false, true, false, false, false, false],
        "Tuesday": [false, false, false, false, true, false, false, false],
        "Wednesday": [false, false, false, true, false, false, false, false],
        "Thursday": [false, false, false, false, true, false, false, false],
        "Friday": [false, false, false, false, true, false, true, false],
      }
    });

    mentors.push({
      name: "Cooper Mistishin", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [true, true, false, false, true, true, true, true],
        "Tuesday": [true, true, false, false, false, false, false, false],
        "Wednesday": [true, true, false, false, true, true, true, true],
        "Thursday": [true, true, false, false, false, false, false, false],
        "Friday": [true, true, false, false, true, true, true, true],
      }
    });

    mentors.push({
      name: "Evan Kinsey", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [true, false, false, false, true, true, false, false],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [true, false, false, false, true, true, false, false],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [true, false, false, false, true, true, false, false],
      }
    });

    mentors.push({
      name: "Hridiza", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, false, true, false, false, false, false],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [false, false, false, false, false, false, false, false],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [false, false, false, true, false, false, false, false],
      }
    });

    mentors.push({
      name: "Max", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [true, true, true, true, false, false, false, false],
        "Tuesday": [true, false, false, false, false, false, false, false],
        "Wednesday": [true, true, true, true, false, false, false, false],
        "Thursday": [true, false, false, false, false, false, false, false],
        "Friday": [true, true, true, true, false, false, false, false],
      }
    });

    mentors.push({
      name: "Ryan Yocum", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [true, false, false, true, true, false, false, false],
        "Tuesday": [false, false, false, false, true, true, false, false],
        "Wednesday": [true, false, false, true, true, false, false, false],
        "Thursday": [false, false, false, false, true, true, false, false],
        "Friday": [true, false, false, true, true, false, false, false],
      }
    });

    mentors.push({
      name: "Sylvia", availability: {
        //4   11    12      1      2      3      4     5
        "Monday": [false, false, false, false, false, false, true, true],
        "Tuesday": [false, false, true, true, true, true, false, false],
        "Wednesday": [false, false, false, false, false, false, true, true],
        "Thursday": [false, false, true, true, true, true, false, false],
        "Friday": [false, false, false, false, false, false, true, true],
      }
    });

    mentors.push({
      name: "Tristen", availability: {
        //4   11    12      1      2      3      4     5
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
    setMentorName(e.currentTarget.value.trim());
  }

  function sortMentors(m1: MentorInterface, m2: MentorInterface) {
    return m1.name.localeCompare(m2.name);
  }
};

export default CreateMentor;
