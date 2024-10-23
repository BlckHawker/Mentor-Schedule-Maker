"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";

interface Props {
  day: string;
  time: string;
  globalMinShifts: number;
  globalMaxShift: number;
  mentors: MentorInterface[];
}

const times = ["10", "11", "12", "1", "2", "3", "4", "5"]

const Filter = (props: Props) => {
  const [minShift, setMinShift] = useState<number>(props.globalMinShifts);
  const [maxShift, setMaxShift] = useState(props.globalMaxShift);

  return (
    <div>
        <p>{props.time}</p>
      <b>Min Shifts:</b>
      <input type="text" onChange={(e) => setMinShift(parseInt(e.target.value))} value={minShift}></input>
      <b>Max Shifts:</b>
      <input type="text" onChange={(e) => setMaxShift(parseInt(e.target.value))} value={maxShift}></input>
      <b>Mentors</b>
      {Array.from({ length: maxShift }).map((_) => (
        <select>
          {props.mentors
            .filter((mentor) => mentor.availability[props.day as keyof MentorInterface['availability']][times.indexOf(props.time)])
            .map((mentor) => (
              <option key={mentor.name} value={mentor.name}>
                {mentor.name}
              </option>
            ))}
        </select>
      ))}
    </div>
  );
};

export default Filter;
