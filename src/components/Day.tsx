//represents a day
//todo: use a momospace font blocks are not as off putting
'use client';
import Block from '@/components/Block';
interface Props {
    day: string;
    availability: boolean[]
}
const Day = (props: Props) => {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center" } }>
            <p>{props.day}</p>
            <Block time={"10am"} availability={props.availability} index={0}></Block>
            <Block time={"11am"} availability={props.availability} index={1}></Block>
            <Block time={"12pm"} availability={props.availability} index={2}></Block>
            <Block time={"1pm"} availability={props.availability} index={3}></Block>
            <Block time={"2pm"} availability={props.availability} index={4}></Block>
            <Block time={"3pm"} availability={props.availability} index={5}></Block>
            <Block time={"4pm"} availability={props.availability} index={6}></Block>
            <Block time={"5pm"} availability={props.availability} index={7}></Block>
        </div>
    );
}

export default Day;