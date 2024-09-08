"use client";
import Link from 'next/link';
const NavBar = () => {
    return (
        <div>
            <Link href={"/"}>Home</Link><br/>
            <Link href={"/mentor/create"}>Create Mentor</Link><br/>
            <Link href={"/mentor/edit"}>View/Edit mentor</Link><br/>
            <Link href={"/mentor"}>View all mentor availability</Link><br />
            <Link href={"/schedule"}>Generate Schedule</Link>

        </div>
    );
}

export default NavBar;