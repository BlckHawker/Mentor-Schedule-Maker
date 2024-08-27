// Used to make/edit a mentor's availability
import { useEffect, useState } from "react";

interface Props {
    time: string;
    availability: boolean[];
    index: number;
}

const Block = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    console.log("is active use effect: " + isActive)
    props.availability[props.index] = isActive;
  }, [isActive]);
  return (
    <div style={{display: "flex", gap: "10px", alignItems: "center" } }>
      <p>{props.time}</p>
      <button style={{backgroundColor: `${isActive ? "green" : "white"}`, width: "75px", height: "35px" } } onClick={() => buttonClick()}></button>
    </div>
  );

  function buttonClick() {
    setIsActive(active => !active);
  }
};

export default Block;
