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
  setAbstractFilters: any; //todo replace this with the function
}

const times = ["10", "11", "12", "1", "2", "3", "4", "5"];

const Filter = (props: Props) => {
  const [minShift, setMinShift] = useState<number>(props.globalMinShifts);
  const [maxShift, setMaxShift] = useState(props.globalMaxShift);
  const [nobodyWorks, setNobodyWorks] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignContent: "center", textAlign: "center"}}>
      <u>{props.time + (["10", "11"].includes(props.time) ? " am" : " pm")}</u>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", border: "dotted rgba(0, 0, 0, 0.5)", marginLeft: "200px", marginRight: "200px"} }>
        <div style={{marginTop: "10px"}}>
          <input type="checkbox" checked={nobodyWorks} onChange={(e) => setNobodyWorks(e.target.checked)}></input>
          <b>Nobody works this shift</b>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <b>Min Shifts:</b>
          < input type="text" style={{ width: "30px" }} disabled={nobodyWorks} onChange={(e) => setMinShift(parseInt(e.target.value))} value={minShift}></input>
          <b>Max Shifts:</b>
          <input type="text" style={{ width: "30px" }} disabled={nobodyWorks} onChange={(e) => setMaxShift(parseInt(e.target.value))} value={maxShift}></input>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <b>Mentors</b>
          {getMentorDropDown()}
        </div>

        <button style={{marginBottom: "20px", width:"65px"}} onClick={() => deleteFilter()}>Delete</button>
      </div>
    </div>
  );

  //todo: make it so the drop down items are centered
  function getMentorDropDown() {
    const relevantMentors = props.mentors.filter((mentor) => mentor.availability[props.day as keyof MentorInterface["availability"]][times.indexOf(props.time)]);
    const mentorNames = ['Any'].concat(relevantMentors.map(mentor => mentor.name));
    return Array.from({ length: minShift }).map((_) => (
      <select disabled={nobodyWorks}>
        {
          mentorNames
          .map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
      </select>
    ))
  }
  function deleteFilter() {
    const newAbstractFilter = props.abstractFilters.filter((f) => !(f.day == props.day && f.time == props.time));
    props.setAbstractFilters(newAbstractFilter);
  }
};

export default Filter;
