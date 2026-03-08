"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Journal Publications', href: '/resources/journal-publications' },
  { label: 'SDL Publications', href: '/resources/sdl-publications' },
  { label: 'Preclinical Studies', href: '/resources/preclinical-studies' },
];

export default function TabNavigation() {
  const pathname = usePathname();
  
  return (
    <nav className="tabs-nav" aria-label="Resources navigation">
      <ul className="tabs-list hide-scrollbar">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <li
              key={tab.href}
              className={`tabs-item ${isActive ? 'is-active' : ''}`}
            >
              <Link
                href={tab.href}
                className="tabs-link"
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="tabs-link-inner">
                  <span className="tabs-label">{tab.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
