export const getRecentItems = () => {
    return JSON.parse(localStorage.getItem('RecentReviewed')) || []
}

export const saveRecentItems = (recentViewed) => {
    localStorage.setItem('RecentReviewed', JSON.stringify(recentViewed))
}