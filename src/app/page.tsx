
import NavBar from '@/components/NavBar';
export default function Home() {
  return (
      <div>
        <NavBar boldedWord={'Home'}/>
        <h2 style={{textAlign: "center"}}>What is this?</h2>
        <p style={{textAlign: "center"}}>This website displays all the possible schedules for mentors given their availability. Here is a list of what all the pages do.</p>

        <div style={{textAlign: "center"}}>
          <p><b>Create/Edit Mentor</b>: Add a mentor into local storage, or change an existing mentor's availability</p>
          <p><b>View Mentors</b>: View all mentors in local storage. Delete a mentor from local storage</p>
          <p><b>Generate Schedules</b>: Generate schedules based on a variety of parameters</p>
          <p><b>View Schedules</b>: View generated schedules in local storage</p>
        </div>
        
      </div>
  );
}
