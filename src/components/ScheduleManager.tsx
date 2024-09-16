"use client";
import { Color } from "@/app/interface/Color";
import { Day } from "@/app/interface/Day";
import { Schedule } from "@/app/interface/Schedule";
import { useState } from "react";
import IndividualSchedule from "./IndividualSchedule";

interface Props {
    savedSchedules: Schedule[],
    mentorNames: string[],
    colorDictionary: Color[],
    days: (keyof Schedule)[];
    times: (keyof Day)[];

}

const ScheduleManager = (props: Props) => {
    const scheduleNumberOptions = ["3", "5", "10", "20"];
    const [schedulesPerPage, setSchedulesPerPage] = useState(3);
    const [pageIndex, setPageIndex] = useState(0);

    if (props.savedSchedules && props.savedSchedules.length > 0) {
        return (
            <div>
                <select onChange={(e) => {changeSchedulesPerPage(Number(e.target.value))}}>
                    
                    {scheduleNumberOptions.map(num => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
                <button disabled={pageIndex === 0} onClick={() => { setPageIndex(ix => ix - 1) }}>Previous Page</button>
                <button disabled={getEndIndex() + 1 >= props.savedSchedules.length} onClick={() => { setPageIndex(ix => ix + 1) }} >Next Page</button>
                <p>Page {pageIndex + 1} of {Math.ceil(props.savedSchedules.length / schedulesPerPage)}</p>
                {showSchedules()}
            </div>
        )
    }

    else {
        return (<p></p>)
    }

    function showSchedules() {
        const startingIndex = getStartIndex();
        const endingIndex = getEndIndex();

        //console.log(startingIndex, endingIndex);
        const targetSchedules = props.savedSchedules.filter((_, ix) => ix >= startingIndex && ix <= endingIndex);
        return targetSchedules.map((schedule, ix) =>
            <div>
                <h3>Schedule {startingIndex + ix + 1}</h3>
                <IndividualSchedule schedule={schedule} days={props.days} times={props.times} mentorNames={props.mentorNames} colorDictionary={props.colorDictionary} />
            </div>)
    }

    function getStartIndex() {
        return pageIndex * schedulesPerPage;
    }

    function getEndIndex() {
        return pageIndex * schedulesPerPage + schedulesPerPage - 1;
    }

    function changeSchedulesPerPage(num: number) {
        setSchedulesPerPage(num);
        setPageIndex(0);
    }
}

export default ScheduleManager;