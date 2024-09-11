"use client";
import { Day } from "@/app/interface/Day";
import { Schedule } from "@/app/interface/Schedule";

interface Props {
    schedule: Schedule;
    days: (keyof Schedule)[];
    times: (keyof Day)[];
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
                                <td key={day}>{props.schedule[day][time][0]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IndividualSchedule;