import { createPortal } from "react-dom"

const Overlay = ({children, onClick, isVisible, isSideModelShow}) => {
    return createPortal(
        <div
        className={`z-10 fixed left-0 right-0 bottom-0 ${isSideModelShow ? "top-0" : "top-[120px]"} bg-opacity-50 transition-all ${isVisible ? "opacity-100" : "opacity-0"} ease-in-out duration-300`}
        style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0))",
            cursor: "url('/public/cursor.svg'), auto"
        }}
        onClick={onClick}
        >
        {children}
        </div>,
        document.getElementById("overlay-root")
    )
}
export default Overlay