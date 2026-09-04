import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PageConfig } from '../types';

interface PageContextType {
  pages: PageConfig[];
  addPage: (page: PageConfig) => void;
  updatePage: (page: PageConfig) => void;
  deletePage: (id: string) => void;
  togglePageStatus: (id: string) => void;
  getPageByUrl: (urlPath: string) => PageConfig | undefined;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<PageConfig[]>(() => {
    const savedPages = localStorage.getItem('ctaPages');
    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error parsing pages from local storage", e);
      }
    }
    // Default initial pages as requested by user
    return [
      {
        id: "client-ola",
        urlPath: "ola",
        companyName: "Ola Cabs",
        heading: "Book Safe & Affordable Rides in Seconds",
        subHeading: "Experience seamless urban mobility with verified drivers and instant booking.",
        buttonTitle: "Book Ola Ride Now",
        buttonColor: "#84cc16",
        link: "https://www.olacabs.com",
        backgroundImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        badgeText: "India's Preferred Ride-Hailing Service",
        isActive: true
      },
      {
        id: "client-uber",
        urlPath: "uber",
        companyName: "Uber",
        heading: "Go Anywhere with Uber On-Demand Rides",
        subHeading: "Reliable rides at the tap of a button, available 24/7 in 10,000+ cities worldwide.",
        buttonTitle: "Get an Uber Ride",
        buttonColor: "#000000",
        link: "https://www.uber.com",
        backgroundImage: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        badgeText: "Global Leader in On-Demand Mobility",
        isActive: true
      },
      {
        id: "client-rapido",
        urlPath: "rapido",
        companyName: "Rapido",
        heading: "Beat Traffic Fast with Rapido Bike Taxis",
        subHeading: "Quick, affordable, and safe bike rides through city traffic at unbeatable fares.",
        buttonTitle: "Ride Rapido Now",
        buttonColor: "#eab308",
        link: "https://www.rapido.bike",
        backgroundImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        badgeText: "Fastest Bike Taxi & Auto Service",
        isActive: true
      },
      {
        id: "client-1",
        urlPath: "gutter-renewal",
        companyName: "Gutter Renew",
        heading: "Protect Your Home Foundation with Premium Gutter Renewal",
        subHeading: "Get a free, fast estimate for gutter cleaning, repair, and replacement in your area.",
        buttonTitle: "Get Your Free Quote",
        buttonColor: "#10b981",
        link: "https://www.gutterrenew.com",
        backgroundImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
        badgeText: "Top-Rated Regional Exterior Specialists",
        isActive: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ctaPages', JSON.stringify(pages));
  }, [pages]);

  const addPage = (page: PageConfig) => {
    setPages(prev => [...prev, page]);
  };

  const updatePage = (updatedPage: PageConfig) => {
    setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const togglePageStatus = (id: string) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const getPageByUrl = (urlPath: string) => {
    return pages.find(p => p.urlPath === urlPath);
  };

  return (
    <PageContext.Provider value={{ pages, addPage, updatePage, deletePage, togglePageStatus, getPageByUrl }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
};
