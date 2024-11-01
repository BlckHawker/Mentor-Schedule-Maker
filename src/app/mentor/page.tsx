//where to view all the mentors
import ViewMentor from "@/components/ViewMentor"
import NavBar from "@/components/NavBar";

//can route to the create mentor page
const Mentor = () => {
  return (
    <div>
      <NavBar/>
      <ViewMentor></ViewMentor>
    </div>
  );
};

export default Mentor;
