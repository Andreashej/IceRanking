import React from 'react';
import { LowerThird } from './components/LowerThird';
import { FlatListItem } from '../../../components/partials/FlatList';
import { AnimatedFlatList } from './components/AnimatedFlatList';

type CustomProps = {
    title: string;
    subtitle: string;
}

const CustomListItem: React.FC<FlatListItem<CustomProps, null>> = ({ item, onHidden, show }) => {
    return (
        <LowerThird header={<>{item.title}</>} onHidden={onHidden} show={show} className="flatlist-item">
            <div>
                <span>{item.subtitle}</span>
            </div>
        </LowerThird>
    )
}

export const Custom: React.FC<CustomProps> = (props) => {
    return (
        <>
            <AnimatedFlatList items={[{id: "custom", ...props}]} RenderComponent={CustomListItem} itemsPerPage={1} usePlaceholder={false} />
        </>
    )
}