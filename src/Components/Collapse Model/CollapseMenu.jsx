import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
} from "../Side Models/Side Model Fuctions/TouchHanddle";

const CollapseMenu = ({ iscollapseShow, setIscollapseShow }) => {
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  const location = useLocation(); 

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "iPhone", path: "/iphone" },
    { name: "iPad", path: "/ipad" },
    { name: "MacBook", path: "/mac" },
    { name: "Watch", path: "/watch" },
    { name: "AirPods", path: "/airpods" },
    { name: "Accessories", path: "/accessories" },
    { name: "Pre-Owned Devices", path: "/pre-owned-devices" },
  ];

  // Reset translateY when menu opens
  useEffect(() => {
    if (!iscollapseShow) setTranslateY(0);
  }, [iscollapseShow]);

  return (
    <>
      <div
        className={`md:hidden bottom-0 w-full h-[90vh] bg-white shadow-2xl rounded-t-[20px] font-inter-sans fixed z-50
        transform transition-transform ease-out duration-500
        ${
          iscollapseShow
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-full pointer-events-none"
        }`}
        style={{
          transform:
            iscollapseShow && translateY > 0 ? `translateY(${translateY}px)` : "",
        }}
        onTouchStart={(event) => handleTouchStart(event, startYRef)}
        onTouchMove={(event) =>
          handleTouchMove(event, setTranslateY, currentYRef, startYRef)
        }
        onTouchEnd={(event) =>
          handleTouchEnd(setIscollapseShow, translateY, setTranslateY)
        }
      >
        <div className="flex flex-col h-full">
          {/* Handle Bar */}
          <div className="relative py-4">
            <hr className="w-12 border-[2px] rounded-full md:hidden absolute top-2 left-[43%] border-gray-300" />
          </div>

          {/* Menu List */}
          <div className="overflow-y-auto flex-1 px-4 pb-6">
            <ul className="flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIscollapseShow(false);
                      window.scrollTo(0, 0);
                    }}
                    className={`block text-[22px] font-semibold py-3 px-4 rounded-xl transition-all duration-300
                      ${
                        location.pathname === item.path
                          ? "bg-gray-900 text-white shadow-lg scale-[1.02]"
                          : "text-gray-800 hover:bg-gray-100 hover:scale-[1.02]"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center shadow-inner">
            <Link
              to="/user"
              onClick={() => setIscollapseShow(false)}
              className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 text-[15px] font-semibold hover:bg-gray-800 active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18px"
                height="18px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.656"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My Account
            </Link>

            <a
              href="https://www.facebook.com/share/1CSHLsqTjs/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-transform active:scale-90"
            >
              <svg
                fill="currentColor"
                width="22px"
                height="22px"
                viewBox="0 0 1920 1920"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1168.737 487.897c44.672-41.401 113.824-36.889 118.9-36.663l289.354-.113 6.317-417.504L1539.65 22.9C1511.675 16.02 1426.053 0 1237.324 0 901.268 0 675.425 235.206 675.425 585.137v93.97H337v451.234h338.425V1920h451.234v-789.66h356.7l62.045-451.233H1126.66v-69.152c0-54.937 14.214-96.112 42.078-122.058" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollapseMenu;
