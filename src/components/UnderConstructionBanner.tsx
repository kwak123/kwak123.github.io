import React from 'react';
import Image from 'next/image';

export default function UnderConstructionBanner() {
  return (
    <div className="under-construction-banner">
      <div className="banner-img-container">
        <Image src="/under-construction.png" alt="Under Construction" width={140} height={140} />
      </div>
      <h2>This site is currently Under Construction!</h2>
    </div>
  );
}
