import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './NavBar.css';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
const navigate = useNavigate();
const { isAuthenticated, username, logout } = useAuth();

const handleLogout = async () => {
try { await api.logout(); } catch {}
await logout();
navigate('/');
};

return (
<nav className="nav">
<div className="nav__brand"><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Online Exam</Link></div>
<ul className="nav__links">
<li><Link to="/">Home</Link></li>
<li><Link to="/about">About</Link></li>
<li><Link to="/contact">Contact</Link></li>
<li><Link to="/help">Help/FAQ</Link></li>
{!isAuthenticated ? (
<>
<li><Link to="/login">Login</Link></li>
<li><Link to="/register">Register</Link></li>
</>
) : (
<>
<li><Link to="/profile">{username || 'Profile'}</Link></li>
<li><button className="nav__logout" onClick={handleLogout}>Logout</button></li>
</>
)}
</ul>
</nav>
);
}