import React, { useEffect, useState } from "react";

export default function Landing(){
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contact, setContact] = useState({ fullName:'', email:'', mobile:'', city:'' });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(()=>{
    // keep the same API calls you already have
    fetch('/api/projects').then(r=>r.json()).then(setProjects).catch(()=>setProjects([]));
    fetch('/api/clients').then(r=>r.json()).then(setClients).catch(()=>setClients([]));
  },[]);

  async function submitContact(e){
    e.preventDefault();
    // same backend call as before
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(contact) });
    alert('Thank you — we received your message!');
    setContact({ fullName:'', email:'', mobile:'', city:'' });
  }

  async function subscribe(e){
    e.preventDefault();
    await fetch('/api/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email: newsletterEmail })});
    alert('Subscribed!');
    setNewsletterEmail('');
  }

  return (
    <div className="landing-page">
      {/* HEADER */}
      <header className="lp-header">
        <div className="lp-container lp-header-row">
          <div className="brand">
            <img src="/assets/Screenshot 2025-09-19 121333.png" alt="logo" className="brand-logo"/>
            <span className="brand-name">Flipr Labs</span>
          </div>
          <nav className="lp-nav">
            <a href="#projects">Projects</a>
            <a href="#clients">Clients</a>
            <a href="#contact">Contact</a>
            <a href="#newsletter" className="btn-primary small">Get Started</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-container hero-grid">
          <div className="hero-left">
            <h1>Consultation, Design & Marketing</h1>
            <p className="hero-lead">We help ambitious companies build brand & digital experiences.</p>
            <div className="hero-stats">
              <div><strong>250+</strong><div className="small">Projects</div></div>
              <div><strong>120+</strong><div className="small">Clients</div></div>
              <div><strong>10+</strong><div className="small">Awards</div></div>
            </div>
          </div>

          <aside className="hero-form">
            <div className="card form-card">
              <h3>Get a Free Consultation</h3>
              <form onSubmit={(e)=>{ e.preventDefault(); alert('Request received (demo).'); }}>
                <input placeholder="Full name" required />
                <input placeholder="Email address" type="email" required />
                <input placeholder="Phone" />
                <select>
                  <option>Choose Service</option>
                  <option>Design</option>
                  <option>Development</option>
                  <option>Marketing</option>
                </select>
                <button className="btn-primary" type="submit">Request Call</button>
              </form>
            </div>
          </aside>
        </div>
        <img src="/assets/hero-shape.png" alt="" className="hero-shape" />
      </section>

      {/* PROJECTS */}
      <section id="projects" className="lp-section">
        <div className="lp-container">
          <h2 className="section-title">Our Projects</h2>
          <div className="projects-row">
            {projects && projects.length ? projects.map(p=>(
              <div className="project-card" key={p._id}>
                <img src={p.image || '/assets/360_F_233594258_81s2Un5DEpmiHYxuOPAUfnrD0T9we5fd.jpg'} alt={p.name} />
                <div className="project-body">
                  <h4>{p.name}</h4>
                  <p className="small">{p.description}</p>
                  <button className="btn-outline">Read More</button>
                </div>
              </div>
            )) : (
              [1,2,3,4].map(i=>(
                <div className="project-card" key={i}>
                  <img src={'/assets/project'+i+'.jpg'} alt="project" />
                  <div className="project-body">
                    <h4>Project Title</h4>
                    <p className="small">Short description about the project.</p>
                    <button className="btn-outline">Read More</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" className="lp-section lp-section--alt">
        <div className="lp-container">
          <h2 className="section-title">Happy Clients</h2>
          <div className="clients-row">
            {clients && clients.length ? clients.map(c=>(
              <div className="client-card" key={c._id}>
                <div className="client-media"><img src={c.image || '/assets/Screenshot 2025-09-19 121333.png'} /></div>
                <div className="client-body">
                   <p className="small">{c.description}</p>
                  <h4>{c.name}</h4>
                  <div className="small">{c.designation}</div>
                 
                </div>
              </div>
            )) : (
              [1,2,3].map(i=>(
                <div className="client-card" key={i}>
                  <div className="client-media"><img src={'/assets/client'+i+'.jpg'} alt="client" /></div>
                  <div className="client-body">
                    <h4>Client Name</h4>
                    <div className="small">CEO</div>
                    <p className="small">Testimonial or short description from client.</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="lp-section">
        <div className="lp-container contact-grid">
          <div className="contact-left">
            <h2>Not Your Average Realtor</h2>
            <p className="small">We are a strategic partner helping businesses grow via digital products and campaigns.</p>
            <div className="contact-circles">
              <img src="/assets/circle1.png" alt="" />
              <img src="/assets/circle2.png" alt="" />
            </div>
          </div>
          <div className="contact-right">
            <form className="contact-form" onSubmit={submitContact}>
              <input placeholder="Full Name" value={contact.fullName} onChange={e=>setContact({...contact, fullName:e.target.value})} required />
              <input placeholder="Email" value={contact.email} onChange={e=>setContact({...contact, email:e.target.value})} required />
              <input placeholder="Mobile" value={contact.mobile} onChange={e=>setContact({...contact, mobile:e.target.value})} />
              <input placeholder="City" value={contact.city} onChange={e=>setContact({...contact, city:e.target.value})} />
              <button className="btn-primary" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className="lp-section newsletter-section">
        <div className="lp-container newsletter-grid">
          <div>
            <h3>Subscribe to our newsletter</h3>
            <p className="small">Get monthly updates, tips, and offers.</p>
          </div>
          <form onSubmit={subscribe} className="newsletter-form">
            <input placeholder="Email address" value={newsletterEmail} onChange={e=>setNewsletterEmail(e.target.value)} required />
            <button className="btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container footer-grid">
          <div>© 2025 Flipr Labs</div>
          <div className="small">Privacy · Terms · Contact</div>
        </div>
      </footer>
    </div>
  );
}
