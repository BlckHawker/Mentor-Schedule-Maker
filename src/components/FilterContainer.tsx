"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import { AbstractShiftFilter } from "../app/interface/AbstractFilter";
import ShiftFilter from "./ShiftFilter";
import DayFilter from "./DayFilter";

interface Props {
  day: string;
  abstractDayFilters: string[],
  abstractShiftFilters: AbstractShiftFilter[];
  mentors: MentorInterface[];
  globalMinShifts: number;
  globalMaxShift: number;
  showAbstractFilters: DayAbstractFilters;
  setAbstractFilters: React.Dispatch<React.SetStateAction<AbstractShiftFilter[]>>;
  setShowAbstractFilters: React.Dispatch<React.SetStateAction<DayAbstractFilters>>;
  setAbstractDayFilters: any; //todo fix this to not be any
  allowNoneSchedules: boolean
}


const FilterContainer = (props: Props) => {
  return (
    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <b>{props.day}</b>
        <button style={{ marginBottom: "20px", width: "65px", visibility: `${getRelevantFilters().length !== 0 || props.abstractDayFilters.includes(props.day) ? "visible" : "hidden"}`}} onClick={() => toggleDayFilters()}>
          {props.showAbstractFilters[props.day as keyof DayAbstractFilters] ? "Hide" : "Show"}
        </button>
      </div>
      {props.showAbstractFilters[props.day as keyof DayAbstractFilters] &&
        <div>
          {props.abstractDayFilters.find(day => day == props.day) &&
            <DayFilter day={props.day} globalMinShifts={props.globalMinShifts} globalMaxShift={props.globalMaxShift} mentors={props.mentors} allowNoneSchedules={props.allowNoneSchedules} abstractDayFilters={props.abstractDayFilters} setAbstractDayFilters={props.setAbstractDayFilters} />
          }

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(getRelevantFilters().length, 4)}, minmax(0, 1fr))`, placeItems: "center" }}>
            {getRelevantFilters()
              .map((f) => (
                <ShiftFilter
                  mentors={props.mentors}
                  globalMinShifts={props.globalMinShifts}
                  globalMaxShift={props.globalMaxShift}
                  day={props.day}
                  time={f.time}
                  abstractFilters={props.abstractShiftFilters}
                  setAbstractFilters={props.setAbstractFilters}
                  allowNoneSchedules={props.allowNoneSchedules} />
              ))}
          </div>
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
    return props.abstractShiftFilters.filter((f) => f.day == props.day)
  }


};

export default FilterContainer;
