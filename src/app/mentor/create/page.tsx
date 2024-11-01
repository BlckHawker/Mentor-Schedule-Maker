
//where one mentor can be created at a time

import CreateMentor from "@/components/CreateMentor";
import NavBar from "@/components/NavBar";

export default function MentorCreatePage() {
  return (
      <div>
        <NavBar/>
        <CreateMentor></CreateMentor>
      </div>
  );
}