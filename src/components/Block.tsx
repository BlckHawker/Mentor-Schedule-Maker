// Used to make/edit a mentor's availability
import { useState } from "react";

interface Props {
    time: string;
}

const Block = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div style={{display: "flex", gap: "10px", alignItems: "center" } }>
      <p>{props.time}</p>
      <button style={{backgroundColor: `${isActive ? "green" : "white"}`, width: "75px", height: "35px" } } onClick={() => setIsActive(active => !active)}></button>
    </div>
  );
};

export default Block;
