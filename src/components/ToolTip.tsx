"use client";
import { Tooltip } from "react-tooltip";

interface Props {
  mainText: string;
  toolText: string;
  idName: string;
}
const ToolTip = (props: Props) => {
  return (
    <div style={{display: "flex", alignItems: "center"}}>
        <p>{props.mainText}</p>
      <p style={{margin: "0px 0px 20px 0px", height:"20px", width:"10px", background: "rgba(0, 0, 0, 0.4)", padding: "2px 8px", borderRadius: "100%", fontSize: "15px", cursor: "help", color: "white", textAlign: "center"}} data-tooltip-id={props.idName} data-tooltip-content={props.toolText}>?</p>
      <Tooltip id={props.idName} />
    </div>
  );
};

export default ToolTip;
