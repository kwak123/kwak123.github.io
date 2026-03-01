'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navRef = useRef<HTMLElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll to show/hide nav
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide if scrolling down past 50px
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsOpen(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`nav ${isVisible ? 'visible' : 'hidden'}`}
    >
      <Link href="/" style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
        Samuel
      </Link>
      
      {/* Desktop Links */}
      <div className="nav-links desktop-only">
        <Link href="/about">About me</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/blog">Blog</Link>
      </div>

      {/* Hamburger Menu Toggle (Mobile) */}
      <button 
        className="hamburger" 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle menu"
      >
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
      </button>

      {/* Mobile Links */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link href="/about" onClick={() => setIsOpen(false)}>About me</Link>
        <Link href="/projects" onClick={() => setIsOpen(false)}>Projects</Link>
        <Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
      </div>
    </nav>
  );
}
