import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PageConfig } from '../types';
import defaultPagesData from '../data/pages.json';

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
    const committedPages = (defaultPagesData as PageConfig[]) || [];
    const savedPages = localStorage.getItem('ctaPages');
    const deletedIds: string[] = JSON.parse(localStorage.getItem('deletedPageIds') || '[]');

    const pageMap = new Map<string, PageConfig>();
    // Add committed pages that haven't been deleted locally
    committedPages.forEach(p => {
      if (!deletedIds.includes(p.id)) {
        pageMap.set(p.id, p);
      }
    });

    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((p: PageConfig) => {
            if (!deletedIds.includes(p.id)) {
              pageMap.set(p.id, p);
            }
          });
        }
      } catch (e) {
        console.error("Error parsing pages from local storage", e);
      }
    }
    return Array.from(pageMap.values());
  });

  useEffect(() => {
    localStorage.setItem('ctaPages', JSON.stringify(pages));
  }, [pages]);

  const addPage = (page: PageConfig) => {
    // Clear deletion record if re-added
    const deletedIds: string[] = JSON.parse(localStorage.getItem('deletedPageIds') || '[]');
    const updatedDeleted = deletedIds.filter(id => id !== page.id);
    localStorage.setItem('deletedPageIds', JSON.stringify(updatedDeleted));

    setPages(prev => [...prev.filter(p => p.id !== page.id), page]);
  };

  const updatePage = (updatedPage: PageConfig) => {
    setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  };

  const deletePage = (id: string) => {
    const deletedIds: string[] = JSON.parse(localStorage.getItem('deletedPageIds') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deletedPageIds', JSON.stringify(deletedIds));
    }
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const togglePageStatus = (id: string) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const getPageByUrl = (urlPath: string) => {
    if (!urlPath) return undefined;
    const normalized = urlPath.trim().toLowerCase();
    return pages.find(p => p.urlPath.trim().toLowerCase() === normalized);
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
