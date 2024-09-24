"use client";
import Link from 'next/link';
const NavBar = () => {
    return (
        <div>
            <Link href={"/"}>Home</Link><br/>
            <Link href={"/mentor/create"}>Create/Edit Mentor</Link><br/>
            <Link href={"/mentor"}>View Mentors</Link><br />
            <Link href={"/schedule/generate"}>Generate Schedules</Link> <br />
            <Link href={"/schedule"}>View Schedules</Link>

        </div>
    );
}

export default NavBar;