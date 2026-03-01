import React from 'react';
import Navigation from '../../components/Navigation';
import UnderConstructionBanner from '../../components/UnderConstructionBanner';

export default function BlogPage() {
  return (
    <div className="container">
      <Navigation />
      <UnderConstructionBanner />
      
      <main>
        <h1 className="section-title">Blog</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Blog posts coming soon.
        </p>
      </main>
    </div>
  );
}
