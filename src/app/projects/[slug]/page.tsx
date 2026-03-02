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

      <main className="mt-0">
        <a href="/projects" className="project-back-link">← Back to Projects</a>
        <h1 className="hero-title project-title">{project.title}</h1>
        
        <div className="tech-stack project-tech-stack">
          {project.techStack.map((tech, idx) => (
            <span key={idx} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        {project.slug === 'azure-copilot' && (
          <div className="project-visual-placeholder">
            [ Azure Copilot Visual Placeholder ]
          </div>
        )}

        <div className="project-content">
          <p>{project.description}</p>
          
          {/* Mock extended content for the detailed page */}
          <h2>The Problem</h2>
          <p className="text-secondary">
            This section will contain a deep dive into the engineering challenges faced during the development of {project.title}.
          </p>

          <h2>Architecture & Solution</h2>
          <p className="text-secondary">
            Here is where we will detail the system architecture, specifically highlighting the usage of {project.techStack.join(', ')}.
          </p>

          <div className="project-actions">
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
