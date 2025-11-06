const FullscreenImage = ({ src, alt, onClose }) => (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80"
        onClick={onClose}
    >
        <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
             <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg"/>
        </div>
        <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-8 hover:cursor-pointer bg-gray-200 text-xl text-black rounded-full h-10 w-10 flex items-center justify-center font-bold
                "
                aria-label="Close fullscreen image"
            >
                &times;
            </button>
    </div>
);

export default FullscreenImage