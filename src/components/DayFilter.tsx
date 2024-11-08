import { useState, useEffect } from "react";
import ToolTip from "./ToolTip";
import { MentorInterface } from "@/app/interface/Mentor";

interface Props {
    day: string;
    globalMinShifts: number;
    globalMaxShift: number;
    mentors: MentorInterface[];
    allowNoneSchedules: boolean;
    abstractDayFilters: string[];
    setAbstractDayFilters: any;
}
const DayFilter = (props: Props) => {
    const [minShift, setMinShift] = useState<number>(props.globalMinShifts);
    const [maxShift, setMaxShift] = useState(props.globalMaxShift);
    const [nobodyWorks, setNobodyWorks] = useState(false);

    useEffect(() => {
        if (!props.allowNoneSchedules) {
            setNobodyWorks(false);
        }
    }, [props.allowNoneSchedules]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignContent: "center", textAlign: "center" }}>
            <u>Day Filter</u>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", border: "dotted rgba(0, 0, 0, 0.5)", marginLeft: "200px", marginRight: "200px" }}>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                    <input id={`day-filter-${props.day}-nobody-works`} type="checkbox" disabled={!props.allowNoneSchedules} checked={nobodyWorks} onChange={(e) => setNobodyWorks(e.target.checked)}></input>
                    <ToolTip mainText={"Nobody works this day"} toolText={"Force nobody to be assigned this day"} idName={`day-filter-${props.day}-nobody-works`} textBold={true} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <ToolTip mainText={"Min Shifts"} toolText={"The minimum amount of mentor for each shift this day"} idName={`day-filter-${props.day}-min-count`} textBold={true} />
                    {getMentorCountDropDown(`day-filter-${props.day}-min-count`, minShift, setMinShift)}
                    <ToolTip mainText={"Max Shifts"} toolText={"The maximum amount of mentor for each shift this day"} idName={`day-filter-${props.day}-max-count`} textBold={true} />
                    {getMentorCountDropDown(`day-filter-${props.day}-max-count`, maxShift, setMaxShift)}
                </div>
                <button style={{ marginBottom: "20px", width: "65px" }} onClick={() => deleteFilter()}>
                    Delete
                </button>
            </div>
        </div>
    );

    function getMentorCountDropDown(idName: string, state: number, onChangeMethod: React.Dispatch<React.SetStateAction<number>>) {
        return (
            <select id={idName} disabled={nobodyWorks} value={state} onChange={(e) => onChangeMethod(parseFloat(e.target.value))}>
                {Array.from({ length: 3 }).map((_, ix) => (
                    <option key={ix + 1} value={ix + 1}>
                        {ix + 1}
                    </option>
                ))}
            </select>
        );
    }
    function deleteFilter() {
        const newAbstractFilter = props.abstractDayFilters.filter((day) => !(day == props.day));
        props.setAbstractDayFilters(newAbstractFilter);
    }
}

export default DayFilter;
