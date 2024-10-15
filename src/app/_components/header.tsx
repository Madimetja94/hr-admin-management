"use client";
import { useState } from "react";
import Link from "next/link";

const Header = ({ session, onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userRole: String = session?.user?.role;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">
          HR Administration System
        </h1>
        <button className="block text-white lg:hidden" onClick={toggleMenu}>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

    
        <nav className="hidden lg:block">
          <ul className="flex space-x-4 text-white">
            <li>
              <button
                className="hover:underline"
                onClick={() => onMenuClick("profile")}
              >
                Profile
              </button>
            </li>
            {userRole === "admin" && (
              <>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("departments")}
                  >
                    Manage Departments
                  </button>
                </li>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("employees")}
                  >
                    Manage Employees
                  </button>
                </li>
              </>
            )}
            {userRole === "manager" && (
              <>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("departments")}
                  >
                    My Departments
                  </button>
                </li>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("employees")}
                  >
                    My Employees
                  </button>
                </li>
              </>
            )}
            {userRole === "user" && (
              <>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("my-profile")}
                  >
                    My Profile
                  </button>
                </li>
              </>
            )}
            <li>
              <Link href="/api/auth/signout" className="hover:underline">
                Sign Out
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="lg:hidden">
          <ul className="flex flex-col space-y-2 bg-gray-800 p-4 text-white">
            <li>
              <button
                className="hover:underline"
                onClick={() => onMenuClick("profile")}
              >
                Profile
              </button>
            </li>
            {userRole === "admin" && (
              <>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("departments")}
                  >
                    Manage Departments
                  </button>
                </li>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("employees")}
                  >
                    Manage Employees
                  </button>
                </li>
              </>
            )}
            {userRole === "manager" && (
              <>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("departments")}
                  >
                    My Departments
                  </button>
                </li>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("employees")}
                  >
                    My Employees
                  </button>
                </li>
              </>
            )}
            {userRole === "user" && (
              <>
                <li>
                  <button
                    className="hover:underline"
                    onClick={() => onMenuClick("profile")}
                  >
                    My Profile
                  </button>
                </li>
              </>
            )}
            <li>
              <Link href="/api/auth/signout" className="hover:underline">
                Sign Out
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
