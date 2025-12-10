import React, { useEffect, useState } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminPanel from './admin/AdminPanel';

export default function Admin(){
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  useEffect(()=>{
    const t = localStorage.getItem('admin_token');
    if(t) setToken(t);
  },[]);
  function onLogin(token){
    localStorage.setItem('admin_token', token);
    setToken(token);
  }
  function onLogout(){
    localStorage.removeItem('admin_token');
    setToken(null);
  }
  return token ? <AdminPanel token={token} onLogout={onLogout} /> : <AdminLogin onLogin={onLogin} />;
}
