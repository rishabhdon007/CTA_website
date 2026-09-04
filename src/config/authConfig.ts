/**
 * Auth Configuration & Validation Utility
 * 
 * SECURITY ARCHITECTURE EXPLANATION:
 * -----------------------------------
 * In a client-side React Single Page Application (SPA), all code running in the browser
 * is publicly visible. Even if environment variables are used in Vite (with `VITE_`), 
 * Vite bakes those values into the final JavaScript bundle sent to the user's browser.
 * 
 * FOR PRODUCTION SECURITY:
 * 1. Authentication should be processed by a Backend API (e.g. Node.js/Express, Next.js API, or Serverless Function).
 * 2. The backend server reads `process.env.ADMIN_PASSWORD` securely (which NEVER gets sent to the browser).
 * 3. The server compares passwords and returns a secure HTTP-Only session cookie or JWT token.
 * 
 * Below is the modular client-side authentication validator for this SPA prototype.
 */

export const validateAdminCredentials = (username: string, password: string): boolean => {
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';

  return username.trim() === adminUsername && password === adminPassword;
};
