import React, { useState } from 'react';
export default function AdminLogin({ onLogin }){
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password})});
    if (res.ok){ const j = await res.json(); onLogin(j.token); } else { alert('Login failed'); }
  }
  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <input value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="small">Tip: use /api/setup-admin to create admin (see README)</p>
    </div>
  )
}
