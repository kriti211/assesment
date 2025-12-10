import React, { useEffect, useState } from 'react';

function UploadForm({ token, url, fields, onDone }){
  const [file, setFile] = useState(null);
  const [values, setValues] = useState(fields.reduce((s,f)=>({...s,[f.name]:''}),{}));
  async function submit(e){
    e.preventDefault();
    const fd = new FormData();
    if (file) fd.append('image', file);
    for(const k in values) fd.append(k, values[k]);
    const res = await fetch('https://assesment-sm4p.onrender.com/api/login', { method:'POST', headers: { Authorization: 'Bearer ' + token }, body: fd });
    if(res.ok){ onDone(); setFile(null); setValues(fields.reduce((s,f)=>({...s,[f.name]:''}),{})); }
    else { alert('Error'); }
  }
  return (
    <form onSubmit={submit} className="container">
      <div className="form-row">
        {fields.map(f=> <input key={f.name} placeholder={f.label} value={values[f.name]} onChange={e=>setValues({...values,[f.name]:e.target.value})} />)}
      </div>
      <div className="form-row">
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </div>
    </form>
  )
}

export default function AdminPanel({ token, onLogout }){
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subs, setSubs] = useState([]);

  async function loadAll(){
    const h = { Authorization: 'Bearer ' + token };
    const [p,c,ct,s] = await Promise.all([fetch('/api/projects').then(r=>r.json()), fetch('/api/clients').then(r=>r.json()), fetch('/api/contacts',{headers:h}).then(r=>r.json()), fetch('/api/subscribers',{headers:h}).then(r=>r.json())]);
    setProjects(p); setClients(c); setContacts(ct); setSubs(s);
  }
  useEffect(()=>{ loadAll(); },[]);

  async function del(url, id){
    if(!confirm('Delete?')) return;
    await fetch(url + '/' + id, { method:'DELETE', headers: { Authorization: 'Bearer ' + token } });
    loadAll();
  }

  return (
    <div className="container admin-grid">
      <div>
        <h3>Admin</h3>
        <div className="tabs">
          <button onClick={()=>setTab('projects')}>Projects</button>
          <button onClick={()=>setTab('clients')}>Clients</button>
          <button onClick={()=>setTab('contacts')}>Contacts</button>
          <button onClick={()=>setTab('subs')}>Subscribers</button>
          <button onClick={onLogout}>Logout</button>
        </div>

        {tab==='projects' && <div>
          <UploadForm token={token} url="/api/projects" fields={[{name:'name', label:'Project Name'},{name:'description', label:'Description'}]} onDone={loadAll} />
          <h4>Existing Projects</h4>
          {projects.map(p=>(<div key={p._id} className="card"><h4>{p.name}</h4><p className="small">{p.description}</p><button onClick={()=>del('/api/projects', p._id)}>Delete</button></div>))}
        </div>}

        {tab==='clients' && <div>
          <UploadForm token={token} url="/api/clients" fields={[{name:'name', label:'Client Name'},{name:'designation', label:'Designation'},{name:'description', label:'Description'}]} onDone={loadAll} />
          <h4>Existing Clients</h4>
          {clients.map(c=>(<div key={c._id} className="card"><h4>{c.name} <span className="small">({c.designation})</span></h4><p className="small">{c.description}</p><button onClick={()=>del('/api/clients', c._id)}>Delete</button></div>))}
        </div>}

        {tab==='contacts' && <div>
          <h4>Contact Form Responses</h4>
          {contacts.map(ct=> (<div key={ct._id} className="card"><strong>{ct.fullName}</strong><div className="small">{ct.email} | {ct.mobile} | {ct.city}</div></div>))}
        </div>}

        {tab==='subs' && <div>
          <h4>Subscribers</h4>
          {subs.map(s=> (<div key={s._id} className="card"><div>{s.email}</div></div>))}
        </div>}
      </div>

      <div>
        <h3>Preview (Landing)</h3>
        <div>
          <h4>Projects</h4>
          <div className="grid">{projects.map(p=>(<div key={p._id} className="card">{p.image && <img src={p.image} alt={p.name} />}<h5>{p.name}</h5></div>))}</div>
        </div>

        <div style={{marginTop:16}}>
          <h4>Clients</h4>
          <div className="grid">{clients.map(c=>(<div key={c._id} className="card">{c.image && <img src={c.image} alt={c.name} />}<h5>{c.name}</h5></div>))}</div>
        </div>
      </div>
    </div>
  )
}
