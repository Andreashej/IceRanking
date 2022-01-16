import React from 'react';

export const Skeleton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    return <div className="skeleton" style={{
        backgroundColor: "hsl(201, 55%, 78%)",
        height: "16px",
        width: "80%",
        borderRadius: ".25rem",
        ...style
    }}>

    </div>
} 