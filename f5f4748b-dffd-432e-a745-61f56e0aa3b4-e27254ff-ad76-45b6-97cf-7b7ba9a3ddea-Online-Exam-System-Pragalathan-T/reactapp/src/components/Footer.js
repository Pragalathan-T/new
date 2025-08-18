import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
return (
<footer className="main-footer">
<div className="main-footer__content">
<div className="main-footer__brand">Online Exam Portal</div>
<nav className="main-footer__links">
<Link to="/about" className="main-footer__link">About Us</Link>
<a href="mailto:support@onlineexam.example" className="main-footer__link">support@onlineexam.example</a>
</nav>
</div>
</footer>
);
}