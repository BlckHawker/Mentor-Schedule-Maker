// Used to make/edit a mentor's availability
import { Availability } from "@/app/interface/Availability";
import { use, useEffect, useState } from "react";

type Day = keyof Availability;
interface Props {
    day: Day;
    index: number;
    availability: Availability;
    setAvailability: Function; //refactor this to be the specific type
}

const Block = (props: Props) => {
  const [isActive, setIsActive] = useState(props.availability[props.day][props.index]);

  useEffect(() => {
    setIsActive(props.availability[props.day][props.index])
  }, [props.availability]);
  useEffect(() => {
    //change the specific availability block 
    const updatedAvailability = { ...props.availability };
    updatedAvailability[props.day][props.index] = isActive;

    props.setAvailability(updatedAvailability);

  }, [isActive]);

  return (
      <button style={{backgroundColor: `${isActive ? "green" : "gray"}`, width: "75px", height: "35px" } } onClick={() => setIsActive((active: boolean) => !active)}></button>
  );
};

export default Block;
