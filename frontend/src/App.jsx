import React, { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import Admin from './pages/Admin';

export default function App(){
  const [route, setRoute] = useState('landing');
  useEffect(()=>{
    const hash = window.location.hash.replace('#','');
    if(hash) setRoute(hash);
    window.addEventListener('hashchange', ()=> setRoute(window.location.hash.replace('#','') || 'landing'));
  },[]);
  return (
    <div>
      <nav className="topnav">
        <a href="#landing">Landing</a>
        <a href="#admin">Admin</a>
      </nav>
      {route==='admin' ? <Admin /> : <Landing />}
    </div>
  )
}
