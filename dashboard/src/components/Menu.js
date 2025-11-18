import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Menu.css';

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("User"); // ✅ Default username
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Component load hote hi username fetch karo
  useEffect(() => {
    const fetchUsername = () => {
      // Try to get username from localStorage
      const savedUsername = localStorage.getItem('username');
      const savedUser = localStorage.getItem('user');
      
      if (savedUsername) {
        console.log('✅ Username from localStorage:', savedUsername);
        setUsername(savedUsername);
      } else if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('✅ Username from user object:', userData.username);
          setUsername(userData.username || "User");
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
        }
      } else {
        console.log('⚠️ No username found in localStorage');
      }
    };

    fetchUsername();
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }
    
    console.log('👋 Starting logout process...');
    
    // ✅ Step 1: Clear dashboard localStorage
    localStorage.clear();
    console.log('✅ Dashboard localStorage cleared');
    
    // ✅ Step 2: Redirect to frontend with special logout URL
    // This will trigger frontend to clear its token
    const frontendUrl = 'http://localhost:3000/?logout=true';
    console.log('🔄 Redirecting to:', frontendUrl);
    
    // Use replace instead of href to avoid back button issues
    window.location.replace(frontendUrl);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  // ✅ Username ke first 2 letters ko uppercase mein avatar ke liye
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
        </ul>
        <hr />

        {/* ✅ Profile Section with Real Username */}
        <div className="profile" onClick={handleProfileClick} ref={dropdownRef}>
          <div className="avatar">{getInitials(username)}</div>
          <p className="username">{username}</p>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <ul>
                <li>My Profile</li>
                <li>Settings</li>
                <li>Help & Support</li>
                <hr />
                <li className="logout" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;