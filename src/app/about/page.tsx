import React from 'react';
import Navigation from '../../components/Navigation';
import UnderConstructionBanner from '../../components/UnderConstructionBanner';

export default function AboutPage() {
  return (
    <div className="container">
      <Navigation />
      <UnderConstructionBanner />
      
      <main>
        <h1 className="section-title">About Me</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Detailed about information coming soon.
        </p>
      </main>
    </div>
  );
}
