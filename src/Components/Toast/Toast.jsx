export default function Toast({ notification }) {
    const { show, message, type } = notification;
    if (!show) return null;
    const toastStyles = {
        info: { bg: 'bg-blue-500', icon: <Info className="w-5 h-5" /> },
        success: { bg: 'bg-green-500', icon: <Check className="w-5 h-5" /> },
        error: { bg: 'bg-red-500', icon: <AlertTriangle className="w-5 h-5" /> },
    };
    const style = toastStyles[type] || toastStyles.info;
    return (
        <div className={`fixed top-5 right-5 ${style.bg} text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down z-50`}>
            {style.icon}
            <p className="text-sm font-medium">{message}</p>
        </div>
    );

}