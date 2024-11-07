"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import { AbstractFilter } from "../app/interface/AbstractFilter";
import Filter from "./Filter";

interface Props {
  day: string;
  abstractFilters: AbstractFilter[];
  mentors: MentorInterface[];
  globalMinShifts: number;
  globalMaxShift: number;
  showAbstractFilters: DayAbstractFilters;
  setAbstractFilters: React.Dispatch<React.SetStateAction<AbstractFilter[]>>;
  setShowAbstractFilters: React.Dispatch<React.SetStateAction<DayAbstractFilters>>;
  allowNoneSchedules: boolean
}


const FilterContainer = (props: Props) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <b>{props.day}</b>
        <button style={{ marginBottom: "20px", width: "65px" }} disabled={getRelevantFilters().length == 0} onClick={() => toggleDayFilters()}>
          {props.showAbstractFilters[props.day as keyof DayAbstractFilters] ? "Hide" : "Show"}
        </button>
      </div>
      {props.showAbstractFilters[props.day as keyof DayAbstractFilters] &&
        <div style={{display: "grid", gridTemplateColumns: `repeat(${Math.min(getRelevantFilters().length, 4)}, minmax(0, 1fr))`,  placeItems: "center"}}>
          {getRelevantFilters()
            .map((f) => (
              <Filter
                mentors={props.mentors}
                globalMinShifts={props.globalMinShifts}
                globalMaxShift={props.globalMaxShift}
                day={props.day}
                time={f.time}
                abstractFilters={props.abstractFilters}
                setAbstractFilters={props.setAbstractFilters}
                allowNoneSchedules={props.allowNoneSchedules} />
            ))}
        </div>
      }
    </div>
  );

  function toggleDayFilters() {
    const newShowAbstractFilters = {
      ...props.showAbstractFilters,
      [props.day as keyof DayAbstractFilters]: !props.showAbstractFilters[props.day as keyof DayAbstractFilters],
    };

    props.setShowAbstractFilters(newShowAbstractFilters);
  }

  function getRelevantFilters() {
    return props.abstractFilters.filter((f) => f.day == props.day)
  }


};

export default FilterContainer;
