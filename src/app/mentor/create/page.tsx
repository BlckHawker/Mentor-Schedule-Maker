
//where one mentor can be created at a time

import CreateMentor from "@/components/CreateMentor";
import NavBar from "@/components/NavBar";

export default function MentorCreatePage() {
  return (
      <div>
        <h1>Mentor Create Page</h1>
        <NavBar/>
        <CreateMentor></CreateMentor>
      </div>
  );
}