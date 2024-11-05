"use client";
import styles from '../css/utils.module.css';

import Link from 'next/link';

interface Props {
    boldedWord: string;
}
const NavBar = (props: Props) => {
    const linkObjs = [{ href: '/', text: 'Home' }, { href: '/mentor/create', text: 'Create/Edit Mentor' }, { href: '/mentor', text: 'View Mentors' }, { href: '/schedule/generate', text: 'Generate Schedules' }, { href: '/schedule', text: 'View Schedules' }]
    return (
        <div className={styles.navbar}>
            {linkObjs.map(obj => <Link href={obj.href}>{props.boldedWord === obj.text ? <b style={{display: "block", marginBlockStart: "1em", marginBlockEnd: "1em", marginInlineStart: "0px", marginInlineEnd: "0px", unicodeBidi: "isolate"}}>{obj.text}</b> : <p>{obj.text}</p>}</Link>)}
        </div>
    );
}

export default NavBar;