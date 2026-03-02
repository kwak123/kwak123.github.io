import React from 'react';
import Navigation from '../../components/Navigation';
import UnderConstructionBanner from '../../components/UnderConstructionBanner';

export default function ProjectsPage() {
  return (
    <div className="container">
      <Navigation />
      <UnderConstructionBanner />
      
      <main>
        <h1 className="section-title">Projects</h1>
        <p className="text-secondary">
          Project listings coming soon.
        </p>
      </main>
    </div>
  );
}
