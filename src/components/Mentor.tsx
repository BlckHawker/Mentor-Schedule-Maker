"use client";
import { useState, useEffect } from "react";
import Row from "@/components/Row"
interface Props {
    name: string
    availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; };
}
const Mentor = (props: Props) => {
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