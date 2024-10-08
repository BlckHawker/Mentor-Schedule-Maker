"use client";
import { Day } from "@/app/interface/Day";
import { Schedule } from "@/app/interface/Schedule";
import { Color } from "@/app/interface/Color";
interface Props {
    schedule: Schedule;
    days: (keyof Schedule)[];
    times: (keyof Day)[];
    mentorNames: string[],
    colorDictionary: Color[],
}
const IndividualSchedule = (props: Props) => {
    if (Object.values(props).some(v => !v)) {
        return <p></p>
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td></td>
                        {props.days.map(day => (
                            <td key={day}>{day}</td>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {props.times.map(time => (
                        <tr key={time}>
                            <td>{time}</td>
                            {props.days.map(day => (
                                renderTimeBlock(props.schedule, props.colorDictionary, day, time)
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function renderTimeBlock(schedule: Schedule, colorDictionary: any, day: keyof Schedule, time: keyof Day) {
    //get the mentors who work that specific block
    const mentors = schedule[day][time];

    switch(mentors.length)
    {
        case 1:
        const obj = getMentorDisplayInfo(0);
        return <td key={day} style={{ backgroundColor: obj.backgroundColor, color: obj.color }}>{mentors[0]}</td>
        case 2:
        return <td key={day}>{[0,1].map(num => getMentorDisplayDiv(num))}</td>
        default:
        return <td key={day}>Not Implemented Yet</td>

    }

    function getMentorDisplayDiv(index: number) {
        const obj = getMentorDisplayInfo(index);
        return <div style={{ backgroundColor: obj.backgroundColor, color: obj.color }}>{mentors[index]}</div>

    }

    function getMentorDisplayInfo(index: number) {
        //colorObj should only be undefined iff the mentor name is "None"
        const colorObj = colorDictionary.find((obj: any) => obj.name === schedule[day][time][index]);
        const backgroundColor = colorObj?.color ?? "white";
        const color = colorObj?.dark ? "white" : "black";

        return {colorObj, backgroundColor, color};
    }
}
export default IndividualSchedule;