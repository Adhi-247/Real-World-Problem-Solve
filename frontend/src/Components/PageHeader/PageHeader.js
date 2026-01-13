import './PageHeader.css';

import React from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';

const ROUTE_META = [
  {
    path: '/disasters',
    title: 'Disasters',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Disasters' },
    ],
  },
  {
    path: '/request-help',
    title: 'Request Help',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Request Help' },
    ],
  },
  {
    path: '/missing-persons',
    title: 'Missing Persons',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Missing Persons' },
    ],
  },
  {
    path: '/volunteer',
    title: 'Volunteer',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Volunteer' },
    ],
  },
  {
    path: '/login',
    title: 'Login',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Login' },
    ],
  },
  {
    path: '/admin/dashboard',
    title: 'Admin Dashboard',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Admin' },
      { label: 'Dashboard' },
    ],
  },
  {
    path: '/disasters/tsunami',
    title: 'Tsunami',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Disasters' },
      { label: 'Tsunami' },
    ],
  },
  {
    path: '/disasters/floods',
    title: 'Floods',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Disasters' },
      { label: 'Floods' },
    ],
  },
  {
    path: '/disasters/wildfire',
    title: 'Wildfire',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Disasters' },
      { label: 'Wildfire' },
    ],
  },
  {
    path: '/disasters/landslide',
    title: 'Landslide',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Disasters' },
      { label: 'Landslide' },
    ],
  },
  {
    path: '/disasters/cyclone',
    title: 'Cyclone',
    crumbs: [
      { label: 'Home', to: '/' },
      { label: 'Disasters' },
      { label: 'Cyclone' },
    ],
  },
];

function getMetaForPath(pathname) {
  for (const meta of ROUTE_META) {
    if (matchPath({ path: meta.path, end: true }, pathname)) return meta;
  }
  return null;
}

function titleFromPath(pathname) {
  const segment = pathname.split('/').filter(Boolean).pop() || '';
  if (!segment) return '';
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PageHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  if (pathname === '/') return null;

  const meta = getMetaForPath(pathname);
  const title = meta?.title ?? titleFromPath(pathname) ?? '';
  const crumbs = meta?.crumbs ?? [
    { label: 'Home', to: '/' },
    { label: title },
  ];

  const onBack = () => {
    // If no history, go home.
    try {
      navigate(-1);
    } catch {
      navigate('/');
    }
  };

  return (
    <header className="page-header" role="banner">
      <div className="page-header__inner container">
        <div className="page-header__top">
          <button
            type="button"
            className="page-header__back"
            onClick={onBack}
            aria-label="Go back"
            title="Back"
          >
            ‹
          </button>

          <nav className="page-header__crumbs" aria-label="Breadcrumb">
            <ol className="page-header__crumbList">
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                const content = crumb.to && !isLast ? (
                  <Link className="page-header__crumbLink" to={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? 'page-header__crumbText page-header__crumbText--current'
                        : 'page-header__crumbText'
                    }
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                );

                return (
                  <li key={`${crumb.label}-${index}`} className="page-header__crumbItem">
                    {content}
                    {!isLast && <span className="page-header__sep">›</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
}
