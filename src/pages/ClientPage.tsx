import React from 'react';
import { useParams } from 'react-router-dom';
import { usePages } from '../context/PageContext';
import { motion } from 'framer-motion';

const ClientPage: React.FC = () => {
  const { clientPath } = useParams<{ clientPath: string }>();
  const { getPageByUrl } = usePages();

  const page = clientPath ? getPageByUrl(clientPath) : null;

  if (!page || !page.isActive) {
    return (
      <div className="cta-page-wrapper" style={{ backgroundColor: 'var(--bg-dark)' }}>
         <div className="cta-content glass-card" style={{ padding: '3rem' }}>
           <h1 className="main-heading" style={{ fontSize: '3rem' }}>404</h1>
           <p style={{ color: 'var(--text-muted)' }}>This page could not be found or has been disabled.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="cta-page-wrapper">
      {page.backgroundImage && (
        <div className="bg-image-container">
          <img src={page.backgroundImage} alt="Background" className="bg-image" />
          <div className="bg-overlay"></div>
        </div>
      )}
      
      {page.companyName && page.companyName.trim() !== '' && (
        <div className="top-bar">
          <div className="logo-container">
            {page.companyName}
          </div>
        </div>
      )}

      <div className="cta-content">
        {page.badgeText && page.badgeText.trim() !== '' && (
          <motion.div 
            className="badge glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={page.buttonColor || '#10b981'} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {page.badgeText}
          </motion.div>
        )}

        {page.heading && page.heading.trim() !== '' && (
          <motion.h1 
            className="main-heading"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {page.heading}
          </motion.h1>
        )}

        {page.subHeading && page.subHeading.trim() !== '' && (
          <motion.div 
            className="sub-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {page.subHeading}
          </motion.div>
        )}

        {page.buttonTitle && page.buttonTitle.trim() !== '' && (
          <motion.div 
            className="cta-button-container"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a 
              href={page.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
              style={{ backgroundColor: page.buttonColor || '#10b981', color: '#fff' }}
            >
              {page.buttonTitle} &rarr;
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClientPage;
