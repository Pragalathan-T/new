import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';

export default function Login() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(null);
const navigate = useNavigate();
const location = useLocation();
const { login } = useAuth();

const onSubmit = async (e) => {
e.preventDefault();
setError(null);
try {
const { role } = await login({ username, password });
const fromState = location.state && location.state.from;
if (fromState) return navigate(fromState, { replace: true });
const dest = `/${role.toLowerCase()}/dashboard`;
navigate(dest);
} catch (err) {
setError('Invalid credentials');
}
};

return (
<div className="auth">
<h2>Login</h2>
<form onSubmit={onSubmit} className="auth__form">
<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<button type="submit">Login</button>
</form>
{error && <p className="auth__error">{error}</p>}
</div>
);
}