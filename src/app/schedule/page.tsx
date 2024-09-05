
//where schedules can be made/viewed

import NavBar from "@/components/NavBar";
import ViewSchedule from "@/components/ViewSchedule";

export default function SchedulePage() {
  return (
      <div>
        <h1>Schedule Page</h1>
        <NavBar/>
        <ViewSchedule></ViewSchedule>
      </div>
  );
}