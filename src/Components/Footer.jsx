import shopLogoWhite from '../assest/wlogo.png';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 px-8 md:px-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <img src={shopLogoWhite} alt="CellExpress" className="h-12 mb-4" />
                    <p className="text-gray-400 text-sm">Your one-stop shop for the latest mobile devices and accessories.</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 tracking-wider">Shop</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><a href="/iphone" className="hover:text-white">iPhones</a></li>
                        <li><a href="/ipad" className="hover:text-white">iPads</a></li>
                        <li><a href="/mac" className="hover:text-white">MacBooks</a></li>
                        <li><a href="/accessories" className="hover:text-white">Accessories</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 tracking-wider">Company</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><a href="/about-us" className="hover:text-white">About Us</a></li>
                        <li><a href="/contact" className="hover:text-white">Contact</a></li>
                        <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions" className="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 tracking-wider">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                        <a href="#" className="hover:text-white"><Instagram /></a>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} CellExpress. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
