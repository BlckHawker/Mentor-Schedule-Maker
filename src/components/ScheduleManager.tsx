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
    const [schedulesPerPage, setSchedulesPerPage] = useState(parseInt(scheduleNumberOptions[0]));
    const [pageIndex, setPageIndex] = useState(0);

    if (props.savedSchedules && props.savedSchedules.length > 0) {
        return (
            <div>
                <label>Mentors Per Page </label>
                <select onChange={(e) => {changeSchedulesPerPage(Number(e.target.value))}}> 
                    {scheduleNumberOptions.map(num => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select> <br /> <br />
                <button disabled={pageIndex === 0} onClick={() => {setPageIndex(0)}}>First Page</button>
                <button disabled={pageIndex === 0} onClick={() => { setPageIndex(ix => ix - 1) }}>Previous Page</button>
                <button disabled={getEndIndex() + 1 >= props.savedSchedules.length} onClick={() => { setPageIndex(ix => ix + 1) }} >Next Page</button>
                <button disabled={getEndIndex() + 1 >= props.savedSchedules.length} onClick={() => {setPageIndex(Math.ceil(props.savedSchedules.length / schedulesPerPage) - 1)}}>Last Page</button>
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

        const targetSchedules = props.savedSchedules.filter((_, ix) => ix >= startingIndex && ix <= endingIndex);
        return <div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr)", placeItems: "center", gap: "20px 0px"}}>
        {targetSchedules.map((schedule, ix) =>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h3>Schedule {startingIndex + ix + 1}</h3>
                <IndividualSchedule schedule={schedule} days={props.days} times={props.times} mentorNames={props.mentorNames} colorDictionary={props.colorDictionary} />
            </div>)}
        </div> 
        
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