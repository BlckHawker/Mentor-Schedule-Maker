// Used to make/edit a mentor's availability
import { useState } from "react";

interface Props {
    time: string;
    availability: boolean[];
    index: number;
}

const Block = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div style={{display: "flex", gap: "10px", alignItems: "center" } }>
      <p>{props.time}</p>
      <button style={{backgroundColor: `${isActive ? "green" : "white"}`, width: "75px", height: "35px" } } onClick={() => buttonClick()}></button>
    </div>
  );

  function buttonClick() {
    setIsActive(active => !active);
    props.availability[props.index] = !isActive; //! this is a jank solution and should be changed immediately
  }
};

export default Block;
