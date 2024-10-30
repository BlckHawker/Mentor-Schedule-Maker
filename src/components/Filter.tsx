"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import { AbstractFilter } from "../app/interface/AbstractFilter";
import ToolTip from "./ToolTip";

interface Props {
  day: string;
  time: string;
  globalMinShifts: number;
  globalMaxShift: number;
  mentors: MentorInterface[];
  abstractFilters: AbstractFilter[];
  setAbstractFilters: any; //todo replace this with the function
  allowNoneSchedules: boolean;
}

const times = ["10", "11", "12", "1", "2", "3", "4", "5"];

const Filter = (props: Props) => {
  const [minShift, setMinShift] = useState<number>(props.globalMinShifts);
  const [maxShift, setMaxShift] = useState(props.globalMaxShift);
  const [nobodyWorks, setNobodyWorks] = useState(false);

  useEffect(() => {
    if (!props.allowNoneSchedules) {
      setNobodyWorks(false);
    }
  }, [props.allowNoneSchedules]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignContent: "center", textAlign: "center" }}>
      <u>{props.time + (["10", "11"].includes(props.time) ? " am" : " pm")}</u>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", border: "dotted rgba(0, 0, 0, 0.5)", marginLeft: "200px", marginRight: "200px" }}>
        <div style={{ marginTop: "10px",  display: "flex", justifyContent: "center" }}>
            <input id={`${props.day}-${props.time}-nobody-works`} type="checkbox" disabled={!props.allowNoneSchedules} checked={nobodyWorks} onChange={(e) => setNobodyWorks(e.target.checked)}></input>
            <ToolTip mainText={"Nobody works this shift"} toolText={"Force nobody to be assigned this shift"} idName={`${props.day}-${props.time}-nobody-works`} textBold={true} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <ToolTip mainText={"Min Shifts"} toolText={"The minimum amount of mentor for this shift"} idName={`${props.day}-${props.time}-minShifts`} textBold={true} />
          {getMentorCountDropDown(`${props.day}-${props.time}-min-count`, minShift, setMinShift)}
          <ToolTip mainText={"Max Shifts"} toolText={"The maximum amount of mentor for this shift"} idName={`${props.day}-${props.time}-minShifts`} textBold={true} />
          {getMentorCountDropDown(`${props.day}-${props.time}-max-count`, maxShift, setMaxShift)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <ToolTip mainText={"Mentors"} toolText={"Force specific mentor(s) to work this shift"} idName={`${props.day}-${props.time}-assigned-mentors`} textBold={true} />
          {getMentorDropDown()}
        </div>
        <button style={{ marginBottom: "20px", width: "65px" }} onClick={() => deleteFilter()}>
          Delete
        </button>
      </div>
    </div>
  );

  //todo: make it so the drop down items are centered
  function getMentorDropDown() {
    const relevantMentors = props.mentors.filter((mentor) => mentor.availability[props.day as keyof MentorInterface["availability"]][times.indexOf(props.time)]);
    const mentorNames = ["Any"].concat(relevantMentors.map((mentor) => mentor.name));
    return Array.from({ length: minShift }).map((_, ix) => (
      <select id={`${props.day}-${props.time}-${ix}`} disabled={nobodyWorks}>
        {mentorNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    ));
  }

  function getMentorCountDropDown(idName: string, state: number, onChangeMethod: React.Dispatch<React.SetStateAction<number>>) {
    return (
      <select id={idName} disabled={nobodyWorks} value={state} onChange={(e) => onChangeMethod(parseFloat(e.target.value))}>
        {Array.from({ length: 3 }).map((_, ix) => (
          <option key={ix + 1} value={ix + 1}>
            {ix + 1}
          </option>
        ))}
      </select>
    );
  }
  function deleteFilter() {
    const newAbstractFilter = props.abstractFilters.filter((f) => !(f.day == props.day && f.time == props.time));
    props.setAbstractFilters(newAbstractFilter);
  }
};

export default Filter;
