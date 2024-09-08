// Used to make/edit a mentor's availability
import { useEffect, useState } from "react";

interface Props {
    time: string;
    availability: boolean[];
    index: number;
}

const Block = (props: Props) => {
  const [isActive, setIsActive] = useState(props.availability[props.index]);
  useEffect(() => {
    console.log("is active use effect: " + isActive)
    props.availability[props.index] = isActive;
  }, [isActive]);
  return (
    <div style={{display: "flex", gap: "10px", alignItems: "center" } }>
      <p>{props.time}</p>
      <button style={{backgroundColor: `${isActive ? "green" : "gray"}`, width: "75px", height: "35px" } } onClick={() => buttonClick()}></button>
    </div>
  );

  function buttonClick() {
    setIsActive(active => !active);
  }
};

export default Block;
