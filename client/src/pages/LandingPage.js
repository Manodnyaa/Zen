import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import "./LandingPage.css"; // we'll create this next

const LandingPage = () => {

  useEffect(() => {

    const aboutSection = document.querySelector(".about-section");

    if (!aboutSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(aboutSection);

    return () => observer.disconnect();

  }, []);

  return (

    <div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">

        <div className="container">

          <Link className="navbar-brand" to="/">
            Zen
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#team">Team</a>
              </li>

              <li className="nav-item">
                <Link className="nav-link btn btn-outline-light ms-2" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link btn btn-light ms-2 text-primary" to="/register">
                  Sign Up
                </Link>
              </li>

            </ul>

          </div>

        </div>

      </nav>


      {/* Hero */}
      <section className="hero">

        <div className="hero-inner">

          <div className="hero-text">

            <span className="hero-badge">
              Mental Wellness Platform
            </span>

            <h1>
              Take control of your<br/>
              mental well-being.
            </h1>

            <p style={{color:"#0b0b14"}}>
              Zen helps you manage stress, anxiety, and emotional balance
              through simple, mindful digital tools.
            </p>

            <div className="hero-actions">

              <Link to="/register" className="btn-primary">
                Get Started
              </Link>

              <a href="#features" className="btn-secondary">
                Learn More
              </a>

            </div>

          </div>

          <div className="hero-visual">

            <img src="/image.png" alt="mental wellness"/>

          </div>

        </div>

      </section>


      {/* Features */}
      <section id="features" className="py-5">

        <div className="container">

          <h2 className="text-center mb-5 fw-bold">
            Features to Support Your Wellbeing
          </h2>

          <div className="row">

            <FeatureCard
              icon="fa-comments"
              title="AI Chatbot"
              text="Talk to our mental health chatbot"
              link="/chatbot"
            />

            <FeatureCard
              icon="fa-book-open"
              title="Journal"
              text="Record your thoughts and feelings"
              link="/journal"
            />

            <FeatureCard
              icon="fa-chart-line"
              title="Mood Tracker"
              text="Track your mood over time"
              link="/mood"
            />

            <FeatureCard
              icon="fa-wind"
              title="Breathing Exercise"
              text="Practice guided breathing exercises"
              link="/breathing"
            />

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer>

        <div className="container text-center">

          <h4>Zen</h4>

          <p>Your companion for mental wellness</p>

          <Link to="/login" className="text-white me-3">
            Login
          </Link>

          <Link to="/register" className="text-white">
            Register
          </Link>

        </div>

      </footer>

    </div>

  );

};


const FeatureCard = ({ icon, title, text, link }) => (

  <div className="col-md-3">

    <div className="feature-card">

      <div className="feature-icon">
        <i className={`fas ${icon}`}></i>
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <Link to={link} className="btn btn-primary mt-3">
        Open
      </Link>

    </div>

  </div>

);


export default LandingPage;