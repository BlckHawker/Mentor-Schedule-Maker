"use client";
import Day from "@/components/Day";
const CreateMentor = () => {
  const availability = {
    Monday: [false, false, false, false, false, false, false, false],
    Tuesday: [false, false, false, false, false, false, false, false],
    Wednesday: [false, false, false, false, false, false, false, false],
    Thursday: [false, false, false, false, false, false, false, false],
    Friday: [false, false, false, false, false, false, false, false],
  };
  return (
    <div style={{ display: "flex", flexDirection:"column", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Day day="Monday" availability={availability["Monday"]}></Day>
        <Day day="Tuesday" availability={availability["Tuesday"]}></Day>
        <Day day="Wednesday" availability={availability["Wednesday"]}></Day>
        <Day day="Thursday" availability={availability["Thursday"]}></Day>
        <Day day="Friday" availability={availability["Friday"]}></Day>
      </div>
      <button>Submit</button>
    </div>
  );
};

export default CreateMentor;
