"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [subscribeMessage, setSubscribeMessage] = useState("Subscribe to a weekly email");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribeMessage("Subscription is unavailable in this local copy.");
  }

  return (
    <main className={`site-shell${sidebarOpen ? "" : " site-shell--wide"}`}>
      <div className="site-preview">
        <iframe title="Lightspark hero" src="/lightspark/index.html" className="lightspark-frame" />
        {!sidebarOpen && (
          <button className="sidebar-reopen" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            Details
          </button>
        )}
      </div>
      {sidebarOpen && (
        <aside className="project-sidebar" aria-label="Project details">
          <div className="sidebar-topbar">
            <button className="sidebar-icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">×</button>
            <div className="sidebar-arrows">
              <button className="sidebar-icon-button" aria-label="Previous post" disabled>←</button>
              <button className="sidebar-icon-button" aria-label="Next post" disabled>→</button>
            </div>
          </div>
          <div className="sidebar-copy">
            <span className="sidebar-tag">Web</span>
            <h1>Personal portfolio</h1>
            <div className="sidebar-creator">
              <img src="/inspora/creator.webp" alt="" />
              <span>@emblemo</span>
            </div>
            <p>Personal portfolio</p>
            <a className="sidebar-original" href="https://x.com/emblemo" target="_blank" rel="noopener noreferrer">View original</a>
          </div>
          <form className="sidebar-subscribe" onSubmit={handleSubscribe}>
            <div className="sidebar-subscribe-row">
              <input type="email" aria-label="Email address" placeholder="you@email.com" required />
              <button type="submit">subscribe</button>
            </div>
            <small aria-live="polite">{subscribeMessage}</small>
          </form>
        </aside>
      )}
    </main>
  );
}
