import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useScreenContext } from "../../BigScreen";
import React from 'react';
import { FlatList, FlatListProps } from "../../../../components/partials/FlatList";
import { Header } from '../components/Header';

type AnimatedFlatListProps<T = any, P = any> = FlatListProps<T, P> & {
    itemsPerPage?: number;
    timePerPage?: number;
    header?: JSX.Element;
    headerImg?: string;
    parentShow?: boolean;
    usePlaceholder?: boolean;

}

export const AnimatedFlatList: React.FC<AnimatedFlatListProps> = ({ header, headerImg, items, itemsPerPage = 6, timePerPage = 10000, RenderComponent, parentShow = true, onHidden, usePlaceholder = true, ...rest }) => {
    const { onTemplateHidden, show: showTemplate } = useScreenContext();
    const [currentPage, setCurrentPage] = useState(0);
    const [show, setShow] = useState<boolean>(showTemplate ?? true);
    const [headerShown, setHeaderShown] = useState(showTemplate ?? true);
    const listRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (itemsPerPage < items.length) {
            const interval = setInterval(() => {
                setShow(false);
            }, timePerPage);
    
            return () => {
                clearInterval(interval);
            }
        }
    }, [timePerPage, itemsPerPage, showTemplate, items.length])

    const handleOnHidden = () => {
        onHidden?.();
        
        if(!showTemplate) {
            setShow(false);
            return;
        }

        const maxPage = Math.ceil(items.length / itemsPerPage) - 1;

        if (currentPage === maxPage) setCurrentPage(0);
        else setCurrentPage((page) => page + 1);
        setShow(true);
    }

    const currentPageItems = useMemo(() => {
        if (items.length === 0) return [];

        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageItems = items.slice(startIndex, endIndex);

        if (usePlaceholder && currentPageItems.length < itemsPerPage) {
            const deltaItems = itemsPerPage - currentPageItems.length;

            for (let i = 0; i < deltaItems; i++) {
                currentPageItems.push(null);

            }
        }

        return currentPageItems;

    }, [currentPage, itemsPerPage, items, usePlaceholder])

    useEffect(() => {
        if (!show && (!headerShown || !header) ) {
            onTemplateHidden?.()
        }
    }, [headerShown, show, onTemplateHidden, header]);

    useEffect(() => {
        if (showTemplate) {
            setCurrentPage(0);
        }
        setShow(showTemplate ?? true);
    }, [showTemplate])

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            {header && <Header headerContent={header} imgSrc={headerImg} onHidden={() => setHeaderShown(showTemplate ?? true)} style={{ gridArea: "header"}} />}
            <div style={{ gridArea: "listarea" }} ref={listRef}>
                {currentPageItems.length > 0 && <FlatList 
                    items={currentPageItems} 
                    RenderComponent={RenderComponent} 
                    hasMoreItems={false} 
                    showItems={show && parentShow && showTemplate} 
                    onHidden={handleOnHidden} 
                    {...rest}
                    />}
            </div>
        </>
    )
}