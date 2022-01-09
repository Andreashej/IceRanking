import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

export type FlatListItem<T, P> = {
    item: T;
    index: number;
    parent: P;
}

export type FlatListProps<T = any, P = any> = {
    items: T[];
    parent?: P; 
    RenderComponent: React.FC<FlatListItem<T, P>>;
    onBottomReached?: () => void;
    hasMoreItems?: boolean;
}

export const FlatList: React.FC<FlatListProps> = ({items, RenderComponent, onBottomReached, hasMoreItems, parent}) => {
    const listBottomRef = useRef<HTMLDivElement>(null);
    const bottomReached = useIntersectionObserver(listBottomRef, { threshold: 0, rootMargin: '50px' });

    const listElements = items.map((item, index) => <RenderComponent item={item} index={index} key={item.id} parent={parent} />);

    useEffect(() => {
        if(bottomReached) onBottomReached?.();
    },[bottomReached, onBottomReached])
    
    return (
        <>
            <ol className="flatlist">
                {listElements}
            </ol>
            {(items.length === 0 || hasMoreItems) && <div ref={listBottomRef} style={{ display: 'flex', }}><ProgressSpinner style={{ outerWidth: 20 }} /></div>}
        </>
    )
}