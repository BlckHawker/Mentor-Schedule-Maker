"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import Row from "@/components/Row"
const Mentor = (props: MentorInterface) => {
    return (
        <div>
            <p>{`${props.name}'s Availability`}</p>
            <table>
                <tr>
                    <td></td>
                    <td>Monday</td>
                    <td>Tuesday</td>
                    <td>Wednesday</td>
                    <td>Thursday</td>
                    <td>Friday</td>
                </tr>
                <Row day={"10am"} row={Object.values(props.availability).map(arr => arr[0])}></Row>
                <Row day={"11am"} row={Object.values(props.availability).map(arr => arr[1])}></Row>
                <Row day={"12pm"} row={Object.values(props.availability).map(arr => arr[2])}></Row>
                <Row day={"1pm"} row={Object.values(props.availability).map(arr => arr[3])}></Row>
                <Row day={"2pm"} row={Object.values(props.availability).map(arr => arr[4])}></Row>
                <Row day={"3pm"} row={Object.values(props.availability).map(arr => arr[5])}></Row>
                <Row day={"4pm"} row={Object.values(props.availability).map(arr => arr[6])}></Row>
                <Row day={"5pm"} row={Object.values(props.availability).map(arr => arr[7])}></Row>
                
            </table>
        </div>
    );
}

export default Mentor;