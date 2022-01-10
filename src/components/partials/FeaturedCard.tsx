import { Card } from 'primereact/card';
import React from 'react';
import { Skeleton } from './Skeleton';

export type FeaturedCardProps = {
    title: string;
    featuredText?: string | null;
    additionalText?: string | null;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({title, featuredText, additionalText}) => {
    return (
        <Card title={title} className="featured-card">
            {featuredText ? <h4 className="display-4 featured-number">{featuredText}</h4> : <Skeleton style={{ height: "3.5rem", marginBottom: "0.5rem" }} />}
            {additionalText ? <p className="lead mb-0">{additionalText}</p> : <Skeleton style={{ height: "1.25rem", width: "60%" }} />}
        </Card>
    )
}