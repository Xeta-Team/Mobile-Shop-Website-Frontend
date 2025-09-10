export default function SocialButton({ provider, icon, onClick }) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold border transition-all duration-300 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105">
        {icon}
        Continue with {provider}
      </button>
    );
}
