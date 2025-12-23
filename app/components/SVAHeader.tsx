"use client";

import "./SVAHeader.css";

interface SVAHeaderProps {
  userName: string;
  userRole?: string;
  greeting?: string;
}

export default function SVAHeader({ userName, userRole, greeting }: SVAHeaderProps) {
  const timeOfDay = new Date().getHours();
  const defaultGreeting =
    timeOfDay < 12 ? "Good morning" : timeOfDay < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="sva-header">
      <div className="sva-header-left">
        <h1 className="sva-greeting">
          {greeting || defaultGreeting}, <span className="sva-user-name">{userName}</span>
        </h1>
        <p className="sva-subgreeting">Ready to continue your learning journey?</p>
      </div>

      <div className="sva-header-right">
        {/* Search */}
        <div className="sva-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search courses, lessons..." />
        </div>

        {/* Notifications */}
        <button className="sva-notification-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="sva-notification-dot"></span>
        </button>

        {/* User Menu */}
        <div className="sva-user-menu">
          <div className="sva-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sva-user-info">
            <span className="sva-user-fullname">{userName}</span>
            {userRole && (
              <span className="sva-user-role">{userRole.replace("_", " ")}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

