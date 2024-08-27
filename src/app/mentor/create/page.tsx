
//where one mentor can be created at a time

import CreateMentor from "@/components/CreateMentor";

export default function MentorCreatePage() {
  return (
      <div>
        <h1>Mentor Create Page</h1>
        <label>Mentor Name: </label>
        <input type="text"></input>
        <CreateMentor></CreateMentor>
      </div>
  );
}