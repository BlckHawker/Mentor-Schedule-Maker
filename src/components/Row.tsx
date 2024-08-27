"use client";
interface Props {
    day: string,
    row: boolean[]
}
const Row = (props: Props) => {
    console.log(props);
    return (
        <tr>
            <td>{props.day}</td>
            {props.row.map((b: boolean) => <td style={{backgroundColor: `${b ? "green" : "gray"}`}} ></td>)}
        </tr>

    );
}

export default Row;