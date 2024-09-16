"use client";
import { Color } from "@/app/interface/Color";
import { Day } from "@/app/interface/Day";
import { Schedule } from "@/app/interface/Schedule";
import { useState } from "react";
import IndividualSchedule from "./IndividualSchedule";
import { time } from "console";

interface Props {
    savedSchedules: Schedule[],
    mentorNames: string[],
    colorDictionary: Color[],
    days: (keyof Schedule)[];
    times: (keyof Day)[];
    
}

const ScheduleManager = (props: Props) => {
    const schedulesPerPage = 3;
    const [pageIndex, setPageIndex] = useState(0);

    return (
        <div>
            <p>{getStartIndex()}-{getEndIndex()}</p>
            <button disabled={pageIndex === 0} onClick={() => {setPageIndex(ix => ix - 1)}}>Previous Page</button>
            <button disabled={getEndIndex() + 1 >= props.savedSchedules.length } onClick={() => {setPageIndex(ix => ix + 1)}} >Next Page</button>
            <p>Page {pageIndex + 1} of {Math.ceil(props.savedSchedules.length / schedulesPerPage)}</p>
            {showSchedules()}
        </div>
    )

    function showSchedules() {
        const startingIndex = getStartIndex();
        const endingIndex = getEndIndex();

        //console.log(startingIndex, endingIndex);
       const targetSchedules = props.savedSchedules.filter((_, ix) => ix >= startingIndex && ix <= endingIndex);
        return targetSchedules.map((schedule, ix) => 
        <div>
            <h3>Schedule {startingIndex + ix + 1}</h3>
            <IndividualSchedule schedule={schedule} days={props.days} times={props.times} mentorNames={props.mentorNames} colorDictionary={props.colorDictionary}/>
        </div> )
    }

    function getStartIndex() {
        return pageIndex * schedulesPerPage;
    }

    function getEndIndex() {
        return pageIndex * schedulesPerPage + schedulesPerPage - 1;
    }
}

export default ScheduleManager;