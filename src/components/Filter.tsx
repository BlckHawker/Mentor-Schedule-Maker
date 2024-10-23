"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import { AbstractFilter } from "./AbstractFilter";

interface Props {
  day: string;
  time: string;
  globalMinShifts: number;
  globalMaxShift: number;
  mentors: MentorInterface[];
  abstractFilters: AbstractFilter[]; 
  setAbstractFilters: any //todo replace this with the function
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
      <button onClick={() => deleteFilter()}>Delete</button>
    </div>
  );

  function deleteFilter() {
    const newAbstractFilter = props.abstractFilters.filter(f => !(f.day == props.day && f.time == props.time))
    console.log("old: ", props.abstractFilters.length)
    console.log("new: ", newAbstractFilter.length)

    props.setAbstractFilters(newAbstractFilter);
    console.log('delete')
  }
};

export default Filter;
