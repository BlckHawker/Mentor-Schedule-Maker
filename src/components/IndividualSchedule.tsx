"use client";
import { Schedule } from "@/app/interface/Schedule";


const IndividualSchedule = (props: Schedule) => {
    //assumes there is only one person on shift
    return (
        <div>
            <table>
                <tr>
                    <td></td>
                    <td>Monday</td>
                    <td>Tuesday</td>
                    <td>Wednesday</td>
                    <td>Thursday</td>
                    <td>Friday</td>
                </tr>
                <tr>
                    <td>10am</td>
                    <td>{props.Monday["10"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>11am</td>
                    <td>{props.Monday["11"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>12pm</td>
                    <td>{props.Monday["12"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>1pm</td>
                    <td>{props.Monday["1"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>2pm</td>
                    <td>{props.Monday["2"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>3pm</td>
                    <td>{props.Monday["3"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>4pm</td>
                    <td>{props.Monday["4"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>
                <tr>
                    <td>5pm</td>
                    <td>{props.Monday["5"][0]}</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                    <td>unfinished</td>
                </tr>                
            </table>
        </div>
    );
}

export default IndividualSchedule;