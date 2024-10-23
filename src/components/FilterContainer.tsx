"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import { useState, useEffect } from "react";
import { AbstractFilter } from "./AbstractFilter";
import Filter from "./Filter";

interface Props {
    day: string;
    time: string;
    abstractFilters: AbstractFilter[] 
    mentors: MentorInterface[];
    globalMinShifts: number;
    globalMaxShift: number;
    
}

const FilterContainer = (props: Props) => {

    return (
        <div><b>{props.day}</b> <button>Hide</button> {props.abstractFilters.filter(f => f.day == props.day).map(_ => <Filter mentors={props.mentors} globalMinShifts={props.globalMinShifts} globalMaxShift={props.globalMaxShift} day={props.day} time={props.time}/>)}</div>
    );
}

export default FilterContainer;
