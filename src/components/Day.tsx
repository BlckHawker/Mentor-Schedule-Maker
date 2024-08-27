//represents a day
//todo: use a momospace font blocks are not as off putting
'use client';
import Block from '@/components/Block';
interface Props {
    day: string;
}
const Day = (props: Props) => {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center" } }>
            <p>{props.day}</p>
            <Block time={"10am"}></Block>
            <Block time={"11am"}></Block>
            <Block time={"12pm"}></Block>
            <Block time={"1pm"}></Block>
            <Block time={"2pm"}></Block>
            <Block time={"3pm"}></Block>
            <Block time={"4pm"}></Block>
            <Block time={"5pm"}></Block>
        </div>
    );
}

export default Day;