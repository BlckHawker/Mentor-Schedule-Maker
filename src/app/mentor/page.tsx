//where to view all the mentors

import Link from "next/link";

//can route to the create mentor page
const Mentor = () => {
  return (
    <div>
      <h1>Mentor Page</h1>
      <Link href="./mentor/create">Go to Mentor Create Page</Link>
    </div>
  );
};

export default Mentor;
