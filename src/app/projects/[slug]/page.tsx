import React from 'react';
import { notFound } from 'next/navigation';
import { projects } from '../../../data/content';
import Navigation from '../../../components/Navigation';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static routes for static export compatible with GitHub Pages
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container">
      <Navigation />

      <main style={{ marginTop: '0px' }}>
        <a href="/projects" style={{display: 'inline-block', marginBottom: '24px', color: 'var(--text-secondary)'}}>← Back to Projects</a>
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>{project.title}</h1>
        
        <div className="tech-stack" style={{ marginBottom: '40px' }}>
          {project.techStack.map((tech, idx) => (
            <span key={idx} className="tech-tag" style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
              {tech}
            </span>
          ))}
        </div>

        {project.slug === 'azure-copilot' && (
          <div style={{
            width: '100%', height: '300px', 
            background: 'var(--card-bg)', 
            borderRadius: '24px', 
            border: '1px solid var(--card-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '40px', color: 'var(--text-secondary)'
          }}>
            [ Azure Copilot Visual Placeholder ]
          </div>
        )}

        <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-primary)', maxWidth: '800px' }}>
          <p>{project.description}</p>
          
          {/* Mock extended content for the detailed page */}
          <h2 style={{ fontSize: '2rem', marginTop: '60px', marginBottom: '24px', fontWeight: 600 }}>The Problem</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            This section will contain a deep dive into the engineering challenges faced during the development of {project.title}.
          </p>

          <h2 style={{ fontSize: '2rem', marginTop: '60px', marginBottom: '24px', fontWeight: 600 }}>Architecture & Solution</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here is where we will detail the system architecture, specifically highlighting the usage of {project.techStack.join(', ')}.
          </p>

          <div style={{ marginTop: '60px', display: 'flex', gap: '16px' }}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <button className="primary-btn">Visit Live App</button>
              </a>
            )}
            <button className="secondary-btn">View GitHub Source</button>
          </div>
        </div>
      </main>
    </div>
  );
}
