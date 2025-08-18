import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Register.css';
import { useAuth } from '../context/AuthContext';

export default function Register() {
const [form, setForm] = useState({ name: '', email: '', username: '', password: '', role: 'STUDENT' });
const [msg, setMsg] = useState(null);
const [err, setErr] = useState(null);
const [busy, setBusy] = useState(false);
const navigate = useNavigate();
const { login } = useAuth();

const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const onSubmit = async (e) => {
e.preventDefault();
if (busy) return;
setBusy(true);
setErr(null); setMsg(null);
try {
await api.register(form);
const { role } = await login({ username: form.username, password: form.password });
setMsg('Registered successfully');
navigate(`/${role.toLowerCase()}/dashboard`, { replace: true });
} catch (e2) {
setErr(e2?.message || 'Registration failed');
} finally {
setBusy(false);
}
};

return (
<div className="auth">
<h2>Register</h2>
<form onSubmit={onSubmit} className="auth__form">
<input name="name" placeholder="Name" value={form.name} onChange={onChange} />
<input name="email" placeholder="Email" value={form.email} onChange={onChange} />
<input name="username" placeholder="Username" value={form.username} onChange={onChange} />
<input name="password" placeholder="Password" type="password" value={form.password} onChange={onChange} />
<select name="role" value={form.role} onChange={onChange}>
<option>STUDENT</option>
<option>TEACHER</option>
<option>ADMIN</option>
</select>
<button type="submit" disabled={busy}>{busy ? 'Registering…' : 'Register'}</button>
</form>
{msg && <p className="auth__success">{msg}</p>}
{err && <p className="auth__error">{err}</p>}
</div>
);
}