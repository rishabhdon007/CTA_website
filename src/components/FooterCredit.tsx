import React from 'react';

const FooterCredit: React.FC = () => {
  return (
    <footer className="footer-credit">
      Designed and Developed by{' '}
      <a 
        href="https://www.devyugsolutions.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >
        Devyug Solutions
      </a>
    </footer>
  );
};

export default FooterCredit;
