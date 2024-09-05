//where to view all the mentors
import ViewMentor from "@/components/ViewMentor"
import NavBar from "@/components/NavBar";

//can route to the create mentor page
const Mentor = () => {
  return (
    <div>
      <NavBar/>
      <h1>Mentor Page</h1>
      <ViewMentor></ViewMentor>
    </div>
  );
};

export default Mentor;
