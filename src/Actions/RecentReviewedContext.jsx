import { useState } from "react";
import { createContext } from "react";
import { getRecentItems, saveRecentItems } from "./RecentReviewedActions";
import { useEffect } from "react";

export const RecentReviewedContext = createContext()

export const RecentReviewedProvider = ({children}) => {
    const [recentViewed, setRecentViewed] = useState(getRecentItems())

    useEffect(() => {
        saveRecentItems(recentViewed)
    }, [recentViewed])

    const addRecentItems = (productId) => {
        setRecentViewed((prevRecentItems) => {
            const existing = recentViewed.find((itemId) => (itemId == productId))

            if(existing){
                return prevRecentItems
            }else{
                return [...prevRecentItems, productId]
            }
        })
    }

    return(<RecentReviewedContext.Provider value={{addRecentItems}}>
        {children}
    </RecentReviewedContext.Provider>)
}