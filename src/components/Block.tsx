// Used to make/edit a mentor's availability
import { useState } from "react";

const Block = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div style={{display: "flex", gap: "10px", alignItems: "center" } }>
      <p>10am</p>
      <button style={{backgroundColor: `${isActive ? "green" : "white"}`, width: "75px", height: "35px" } } onClick={() => setIsActive(active => !active)}></button>
    </div>
  );
};

export default Block;
