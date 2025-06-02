import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';

import forewordLogo from '../../imgs/foreword-logo.png';
import signUpImg from '../../imgs/Sign-up.png';
import reviewPage from '../../imgs/review-page.png';
import communityPage from '../../imgs/community-page.png';
import searchPage from '../../imgs/search-page.png';

export default function Landing() {
  const scrollToContent = () => {
    const content = document.getElementById('landing-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="hero" style={{ backgroundImage: `url(${signUpImg})` }}>
        <img src={forewordLogo} alt="Foreword Logo" className="hero-logo" />
        <h1 className="hero-title">Reading, better together</h1>
        <p className="subtitle">Rate your reads and join the conversation</p>
        <div className="cta-buttons">
            <Link to="/account" className="cta-about">Sign Up</Link>
            <Link to="/about" className="cta-about">About Us</Link>
            <button className="cta-secondary" onClick={scrollToContent}>Learn more</button>

        </div>
      </div>

      <div id="landing-content" className="content-section">
        <div className="section">
          <div className="text-block">
            <h2>Rate Your Reads</h2>
            <h3>Rate books. Start conversations.</h3>
            <p>Give each book a 1–10 score, and share your take with others.</p>
          </div>
          <img src={reviewPage} alt="Write a Book Review" className="section-img" />
        </div>

        <div className="section reverse">
          <div className="text-block">
            <h2>Share your thoughts</h2>
            <h3>Your reading feed powered by <em>friends</em></h3>
            <p>See what your friends are reading, loving, and hating.</p>
          </div>
          <img src={communityPage} alt="Community Page" className="section-img" />
        </div>

        <div className="section">
          <div className="text-block">
            <h2>Discover</h2>
            <h3>Find your next read</h3>
            <p>Follow trending books, ratings from real people, and discover your next read.</p>
          </div>
          <img src={searchPage} alt="Search Books Page" className="section-img" />
        </div>
      </div>
    </div>
  );
}