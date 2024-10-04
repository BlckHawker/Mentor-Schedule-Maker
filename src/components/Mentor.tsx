"use client";
import { MentorInterface } from "@/app/interface/Mentor";
import Row from "@/components/Row"

interface Props {
    mentor: MentorInterface,
    savedMentors: any
    setSavedMentors: any
}

//todo: make Row's a loop just so it's not repetitive

const Mentor = (props: Props) => {
    if(Object.values(props).some(v => v === undefined)) {
        return <p>There was an error. Contact the developers</p>;
    }
    return (
        <div>
            <p>{`${props.mentor.name}'s Availability`}</p> <button onClick={() => deleteMentor()}>Delete</button>
            <table>
                <tr>
                    <td></td>
                    <td>Monday</td>
                    <td>Tuesday</td>
                    <td>Wednesday</td>
                    <td>Thursday</td>
                    <td>Friday</td>
                </tr>
                <Row day={"10am"} row={Object.values(props.mentor.availability).map(arr => arr[0])}></Row>
                <Row day={"11am"} row={Object.values(props.mentor.availability).map(arr => arr[1])}></Row>
                <Row day={"12pm"} row={Object.values(props.mentor.availability).map(arr => arr[2])}></Row>
                <Row day={"1pm"} row={Object.values(props.mentor.availability).map(arr => arr[3])}></Row>
                <Row day={"2pm"} row={Object.values(props.mentor.availability).map(arr => arr[4])}></Row>
                <Row day={"3pm"} row={Object.values(props.mentor.availability).map(arr => arr[5])}></Row>
                <Row day={"4pm"} row={Object.values(props.mentor.availability).map(arr => arr[6])}></Row>
                <Row day={"5pm"} row={Object.values(props.mentor.availability).map(arr => arr[7])}></Row>
                
            </table>
        </div>
    );

    function deleteMentor() {
        const updatedMentors = props.savedMentors.filter((mentor: MentorInterface) => mentor !== props.mentor);
        props.setSavedMentors(updatedMentors);
    }
}

export default Mentor;