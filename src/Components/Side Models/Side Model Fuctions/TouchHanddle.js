export const handleTouchStart = (e, startYRef) => {
    startYRef.current = e.touches[0].clientY;
};

export const handleTouchMove = (e, setTranslateY, currentYRef, startYRef) => {
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;

    if (deltaY > 0) {
        setTranslateY(deltaY);
    }
};

export const handleTouchEnd = (setIsSideModelShow, translateY, setTranslateY) => {
    if (translateY > 100) {
        setIsSideModelShow(false);
    }
    setTranslateY(0);
};