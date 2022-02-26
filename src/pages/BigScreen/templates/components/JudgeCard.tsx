import React from 'react';

export const judgeNoToLetter = (no: number) => {
    switch (no) {
        case 1: return 'A';
        case 2: return 'B';
        case 3: return 'C';
        case 4: return 'D';
        case 5: return 'E';
    }
}

export const JudgeCard: React.FC<{ color: string }> = ({color}) => {
    return (
        <div className="card" style={{ backgroundColor: `var(--${color})` }}></div>
    )
}