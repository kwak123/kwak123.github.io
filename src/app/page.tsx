import React from 'react';
import { personalData, projects, experience } from '../data/content';
import Navigation from '../components/Navigation';
import UnderConstructionBanner from '../components/UnderConstructionBanner';

export default function Home() {
  return (
    <div className="container">
      <Navigation />

      {/* Under Construction Banner */}
      <UnderConstructionBanner />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">{`Building scalable cloud systems and intelligent AI solutions.`}</h1>
            <p className="hero-subtitle">
              {personalData.bio}
            </p>
            <div>
              <a href="#projects">
                <button className="primary-btn">View Projects</button>
              </a>
              <a href={personalData.resumeUrl} target="_blank" rel="noopener noreferrer">
                <button className="secondary-btn">Download Resume</button>
              </a>
            </div>
          </div>
          <div className="hero-visual">
            [ Placeholder for 3D Graphic / Interactive Visual ]
          </div>
        </section>

        {/* Bento Box Projects Grid */}
        <section id="projects">
          <h2 className="section-title">Selected Projects</h2>
          <div className="bento-grid">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className={`bento-card ${project.isHero ? 'hero-card' : ''} ${project.isLarge ? 'large' : ''} ${project.isWide ? 'wide' : ''}`}
              >
                {project.slug === 'azure-copilot' && project.isHero && (
                  <div className="card-visual-placeholder">
                    {/* Placeholder for future visual! */}
                  </div>
                )}
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="card-actions">
                  <a href={`/projects/${project.slug}`} className="card-link">Read More ↗</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section id="work">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {experience.map((job, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-date">{job.date}</div>
                <h3 className="timeline-title">{job.title}</h3>
                <div className="timeline-company">{job.company}</div>
                <p className="timeline-desc">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} {personalData.name}. Built with Next.js.
      </footer>
    </div>
  );
}
