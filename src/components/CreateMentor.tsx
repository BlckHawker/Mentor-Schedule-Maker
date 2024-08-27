'use client';
import Block from '@/components/Block';
import Day from '@/components/Day';

const CreateMentor = () => {
    return (
        <div style={{display: "flex", gap: "10px", justifyContent: "center"  } }>
            <Day day='Monday'></Day>
            <Day day='Tuesday'></Day>
            <Day day='Wednesday'></Day>
            <Day day='Thursday'></Day>
            <Day day='Friday'></Day>
        </div>
    );
}

export default CreateMentor;