import React from 'react';
import Image from 'next/image';

export default function UnderConstructionBanner() {
  return (
    <div className="under-construction-banner" style={{
      backgroundColor: 'var(--card-bg)', 
      border: '1px solid var(--accent-color)', 
      borderRadius: '16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginBottom: '24px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      backdropFilter: 'var(--glass-blur)'
    }}>
      <div className="banner-img-container" style={{ flexShrink: 0 }}>
        <Image src="/under-construction.png" alt="Under Construction" width={140} height={140} style={{ borderRadius: '12px', width: '100%' }} />
      </div>
      <h2 style={{ color: 'var(--accent-color)', margin: 0, fontWeight: 800 }}>This site is currently Under Construction!</h2>
    </div>
  );
}
