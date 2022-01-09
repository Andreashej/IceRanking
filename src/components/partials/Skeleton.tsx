import React from 'react';

export const Skeleton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    return <div style={{
        backgroundColor: "hsl(201, 55%, 78%)",
        height: "16px",
        width: "80%",
        borderRadius: ".25rem",
        animation: "pulsating 3s infinite",
        ...style
    }}>

    </div>
} 