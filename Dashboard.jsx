import React, { useState } from 'react';
import './Dashboard.css';

// Mock data - replace with API calls
const mockUser = {
  name: 'Maya Johnson',
  grade: '7th Grade',
  familyUnit: 'Oak Family',
  avatar: null,
  streak: 12,
  points: 2450,
};

const mockCourses = [
  {
    id: 1,
    title: 'Environmental Stewardship',
    instructor: 'Dr. Sarah Chen',
    progress: 68,
    nextLesson: 'Composting Basics',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
  },
  {
    id: 2,
    title: 'Creative Writing Workshop',
    instructor: 'Mr. James Okonkwo',
    progress: 45,
    nextLesson: 'Character Development',
    category: 'Language Arts',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
  },
  {
    id: 3,
    title: 'Entrepreneurship Fundamentals',
    instructor: 'Ms. Linda Park',
    progress: 82,
    nextLesson: 'Market Research',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
  },
  {
    id: 4,
    title: 'Mixed-Age Mathematics',
    instructor: 'Dr. Ahmed Hassan',
    progress: 31,
    nextLesson: 'Geometry in Nature',
    category: 'Mathematics',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
  },
];

const mockAssignments = [
  { id: 1, title: 'Ecosystem Journal Entry', course: 'Environmental Stewardship', due: '2 days', priority: 'high' },
  { id: 2, title: 'Short Story Draft', course: 'Creative Writing', due: '5 days', priority: 'medium' },
  { id: 3, title: 'Business Plan Outline', course: 'Entrepreneurship', due: '1 week', priority: 'low' },
];

const mockAnnouncements = [
  { id: 1, title: 'Family Unit Showcase This Friday!', time: '2 hours ago', type: 'event' },
  { id: 2, title: 'New Mentorship Pairings Posted', time: '1 day ago', type: 'info' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="sva-dashboard">
      {/* Sidebar */}
      <aside className="sva-sidebar">
        <div className="sva-logo">
          <div className="sva-logo-icon">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="25" width="30" height="25" fill="currentColor" opacity="0.9"/>
              <ellipse cx="30" cy="20" rx="18" ry="15" fill="currentColor"/>
              <path d="M30 35 Q25 45 20 50 M30 35 Q35 45 40 50" stroke="#fdfbf7" strokeWidth="3" fill="none"/>
              <path d="M10 28 Q20 32 30 28 Q40 32 50 28" stroke="#f5a623" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="sva-logo-text">
            <span className="sva-logo-title">Scientia Vitae</span>
            <span className="sva-logo-subtitle">Academy</span>
          </div>
        </div>

        <nav className="sva-nav">
          <button 
            className={`sva-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span>Overview</span>
          </button>
          
          <button 
            className={`sva-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span>My Courses</span>
          </button>

          <button 
            className={`sva-nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span>Assignments</span>
          </button>

          <button 
            className={`sva-nav-item ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => setActiveTab('family')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Family Unit</span>
          </button>

          <button 
            className={`sva-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Schedule</span>
          </button>

          <button 
            className={`sva-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Messages</span>
            <span className="sva-badge">3</span>
          </button>
        </nav>

        <div className="sva-sidebar-footer">
          <button className="sva-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Settings</span>
          </button>
          <button className="sva-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="sva-main">
        {/* Header */}
        <header className="sva-header">
          <div className="sva-header-left">
            <h1 className="sva-greeting">
              Good morning, <span className="sva-user-name">{mockUser.name.split(' ')[0]}</span>
            </h1>
            <p className="sva-subgreeting">Ready to continue your learning journey?</p>
          </div>
          
          <div className="sva-header-right">
            <div className="sva-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search courses, lessons..." />
            </div>
            
            <button className="sva-notification-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="sva-notification-dot"></span>
            </button>
            
            <div className="sva-user-menu">
              <div className="sva-avatar">
                {mockUser.name.charAt(0)}
              </div>
              <div className="sva-user-info">
                <span className="sva-user-fullname">{mockUser.name}</span>
                <span className="sva-user-role">{mockUser.grade} • {mockUser.familyUnit}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <section className="sva-stats">
          <div className="sva-stat-card sva-stat-streak">
            <div className="sva-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <div className="sva-stat-content">
              <span className="sva-stat-value">{mockUser.streak}</span>
              <span className="sva-stat-label">Day Streak</span>
            </div>
            <div className="sva-stat-decoration">🔥</div>
          </div>

          <div className="sva-stat-card sva-stat-points">
            <div className="sva-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="sva-stat-content">
              <span className="sva-stat-value">{mockUser.points.toLocaleString()}</span>
              <span className="sva-stat-label">Knowledge Points</span>
            </div>
          </div>

          <div className="sva-stat-card sva-stat-courses">
            <div className="sva-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div className="sva-stat-content">
              <span className="sva-stat-value">{mockCourses.length}</span>
              <span className="sva-stat-label">Active Courses</span>
            </div>
          </div>

          <div className="sva-stat-card sva-stat-assignments">
            <div className="sva-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="sva-stat-content">
              <span className="sva-stat-value">{mockAssignments.length}</span>
              <span className="sva-stat-label">Pending Tasks</span>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="sva-content-grid">
          {/* Courses Section */}
          <section className="sva-section sva-courses-section">
            <div className="sva-section-header">
              <h2>Continue Learning</h2>
              <a href="#" className="sva-link">View All Courses →</a>
            </div>
            
            <div className="sva-courses-grid">
              {mockCourses.map((course) => (
                <article key={course.id} className="sva-course-card">
                  <div className="sva-course-image" style={{ backgroundImage: `url(${course.image})` }}>
                    <span className="sva-course-category">{course.category}</span>
                  </div>
                  <div className="sva-course-content">
                    <h3 className="sva-course-title">{course.title}</h3>
                    <p className="sva-course-instructor">{course.instructor}</p>
                    <div className="sva-course-progress">
                      <div className="sva-progress-bar">
                        <div 
                          className="sva-progress-fill" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="sva-progress-text">{course.progress}% complete</span>
                    </div>
                    <div className="sva-course-next">
                      <span className="sva-next-label">Next:</span>
                      <span className="sva-next-lesson">{course.nextLesson}</span>
                    </div>
                    <button className="sva-continue-btn">Continue →</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Sidebar Content */}
          <aside className="sva-sidebar-content">
            {/* Announcements */}
            <section className="sva-section sva-announcements">
              <div className="sva-section-header">
                <h2>Announcements</h2>
              </div>
              <div className="sva-announcement-list">
                {mockAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="sva-announcement-item">
                    <div className={`sva-announcement-icon ${announcement.type}`}>
                      {announcement.type === 'event' ? '📅' : 'ℹ️'}
                    </div>
                    <div className="sva-announcement-content">
                      <p className="sva-announcement-title">{announcement.title}</p>
                      <span className="sva-announcement-time">{announcement.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Assignments */}
            <section className="sva-section sva-upcoming">
              <div className="sva-section-header">
                <h2>Upcoming Due</h2>
              </div>
              <div className="sva-assignment-list">
                {mockAssignments.map((assignment) => (
                  <div key={assignment.id} className="sva-assignment-item">
                    <div className={`sva-assignment-priority ${assignment.priority}`}></div>
                    <div className="sva-assignment-content">
                      <p className="sva-assignment-title">{assignment.title}</p>
                      <span className="sva-assignment-course">{assignment.course}</span>
                    </div>
                    <span className="sva-assignment-due">{assignment.due}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="sva-section sva-quick-actions">
              <div className="sva-section-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="sva-actions-grid">
                <button className="sva-action-btn">
                  <span className="sva-action-icon">📝</span>
                  <span>Start Quiz</span>
                </button>
                <button className="sva-action-btn">
                  <span className="sva-action-icon">📚</span>
                  <span>Resources</span>
                </button>
                <button className="sva-action-btn">
                  <span className="sva-action-icon">👥</span>
                  <span>Study Group</span>
                </button>
                <button className="sva-action-btn">
                  <span className="sva-action-icon">🎯</span>
                  <span>Goals</span>
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
