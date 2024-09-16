"use client";
import { Day } from "@/app/interface/Day";
import { Schedule } from "@/app/interface/Schedule";

interface Props {
    schedule: Schedule;
    days: (keyof Schedule)[];
    times: (keyof Day)[];
    mentorNames: string[],
    colorDictionary: { name: string, color: string }[]

}
const IndividualSchedule = (props: Props) => {
    //assumes there is only one person on shift
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
                                <td key={day} style={{backgroundColor: props.colorDictionary.find(obj => obj.name === props.schedule[day][time][0])?.color}}>{props.schedule[day][time][0]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IndividualSchedule;