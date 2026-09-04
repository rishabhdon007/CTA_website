import React, { useState } from 'react';
import { usePages } from '../context/PageContext';
import type { PageConfig } from '../types';
import { Plus, Edit2, Trash2, Power, PowerOff, GitCommit, ExternalLink, LogOut } from 'lucide-react';
import { validateAdminCredentials } from '../config/authConfig';

const Admin: React.FC = () => {
  const { pages, addPage, updatePage, deletePage, togglePageStatus } = usePages();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuth') === 'true';
  });

  const [loginForm, setLoginForm] = useState(() => {
    const savedCreds = localStorage.getItem('adminCredentials');
    if (savedCreds) {
      try {
        const parsed = JSON.parse(savedCreds);
        if (parsed.username && parsed.password) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing saved credentials", e);
      }
    }
    return { username: '', password: '' };
  });

  const [formData, setFormData] = useState<Partial<PageConfig>>({
    urlPath: '',
    companyName: '',
    heading: '',
    subHeading: '',
    buttonTitle: '',
    buttonColor: '#10b981',
    link: '',
    badgeText: '',
    backgroundImage: null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage: PageConfig = {
      id: editingId || Date.now().toString(),
      urlPath: formData.urlPath || '',
      companyName: formData.companyName || '',
      heading: formData.heading || '',
      subHeading: formData.subHeading || '',
      buttonTitle: formData.buttonTitle || '',
      buttonColor: formData.buttonColor || '#10b981',
      link: formData.link || '',
      badgeText: formData.badgeText || '',
      backgroundImage: formData.backgroundImage || null,
      isActive: true,
    };

    if (editingId) {
      updatePage(newPage);
    } else {
      addPage(newPage);
    }

    // Open preview in a new tab
    window.open(`/${newPage.urlPath}`, '_blank');
    setIsFormOpen(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      urlPath: '', companyName: '', heading: '', subHeading: '', badgeText: '',
      buttonTitle: '', buttonColor: '#10b981', link: '', backgroundImage: null
    });
  };

  const openEdit = (page: PageConfig) => {
    setFormData(page);
    setEditingId(page.id);
    setIsFormOpen(true);
  };

  const handleCommit = async () => {
    const token = import.meta.env.GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN;
    if (!token || token === 'dummy_github_token_here') {
      alert("GitHub Token not configured. Please set a valid GITHUB_TOKEN in .env or Vercel Environment Variables to push live commits directly to GitHub.");
      return;
    }

    try {
      const repo = 'rishabhdon007/CTA_website';
      const path = 'src/data/pages.json';
      const jsonString = JSON.stringify(pages, null, 2);
      // Encode UTF-8 text to base64 safely
      const content = btoa(unescape(encodeURIComponent(jsonString)));

      let sha = '';
      const getFileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
      });

      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update CTA pages configuration [${new Date().toLocaleTimeString()}]`,
          content: content,
          branch: 'test-develop',
          ...(sha ? { sha } : {})
        })
      });

      if (putRes.ok) {
        alert(`Successfully committed updated pages configuration to branch 'test-develop' on GitHub (rishabhdon007/CTA_website)!`);
      } else {
        const errData = await putRes.json();
        alert(`GitHub API Commit Status: ${errData.message || 'Failed to commit'}`);
      }
    } catch (err: any) {
      alert(`Commit error: ${err.message}`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAdminCredentials(loginForm.username, loginForm.password)) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuth', 'true');
      localStorage.setItem('adminCredentials', JSON.stringify({
        username: loginForm.username,
        password: loginForm.password
      }));
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
              <input
                required
                className="input-field"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <input
                required
                type="password"
                className="input-field"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleCommit}>
            <GitCommit size={18} style={{ marginRight: '0.5rem' }} />
            Commit to GitHub
          </button>
          <button className="btn btn-primary" onClick={() => { resetForm(); setEditingId(null); setIsFormOpen(true); }}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Add Page
          </button>
          <button className="btn btn-secondary" onClick={handleLogout} title="Logout">
            <LogOut size={18} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </div>

      {isFormOpen ? (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Page' : 'Create New Page'}</h3>
          <form onSubmit={handleSaveAndPreview}>
            <div className="form-grid">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>URL Path * (e.g., ola)</label>
                <input required className="input-field" value={formData.urlPath} onChange={e => setFormData({ ...formData, urlPath: e.target.value })} placeholder="e.g. ola" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Company Name (Optional)</label>
                <input className="input-field" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} placeholder="e.g. Ola Cabs" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Main Heading (Optional)</label>
                <input className="input-field" value={formData.heading} onChange={e => setFormData({ ...formData, heading: e.target.value })} placeholder="e.g. Book Safe Rides in Seconds" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sub Heading (Optional)</label>
                <input className="input-field" value={formData.subHeading} onChange={e => setFormData({ ...formData, subHeading: e.target.value })} placeholder="e.g. Reliable rides 24/7" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Badge Text (Optional)</label>
                <input className="input-field" value={formData.badgeText} onChange={e => setFormData({ ...formData, badgeText: e.target.value })} placeholder="e.g. Top-Rated Mobility Service" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Button Title (Optional)</label>
                <input className="input-field" value={formData.buttonTitle} onChange={e => setFormData({ ...formData, buttonTitle: e.target.value })} placeholder="e.g. Book Now" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Button Color</label>
                <input type="color" className="input-field" style={{ height: '48px', padding: '0.25rem' }} value={formData.buttonColor || '#10b981'} onChange={e => setFormData({ ...formData, buttonColor: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Redirection Link (Optional)</label>
                <input className="input-field" type="url" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://example.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Background Image (Optional)</label>
                <input type="file" accept="image/*" className="input-field" onChange={handleImageUpload} />
                {formData.backgroundImage && <img src={formData.backgroundImage} alt="Preview" style={{ height: '60px', borderRadius: '4px', marginTop: '0.5rem', objectFit: 'cover' }} />}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary">Save & Preview</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="page-list">
          {pages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pages created yet. Click "Add Page" to start.</p>
          ) : (
            pages.map(page => (
              <div key={page.id} className="glass-card page-item" style={{ opacity: page.isActive ? 1 : 0.6 }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {page.companyName}
                    {!page.isActive && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#ef4444', borderRadius: '4px' }}>Disabled</span>}
                  </h3>
                  <a href={`/${page.urlPath}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    /{page.urlPath} <ExternalLink size={14} />
                  </a>
                </div>
                <div className="page-actions">
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', flex: 1 }} onClick={() => openEdit(page)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', flex: 1 }} onClick={() => togglePageStatus(page.id)} title={page.isActive ? 'Disable' : 'Enable'}>
                    {page.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                  <button className="btn btn-danger" style={{ padding: '0.5rem', flex: 1 }} onClick={() => { if (window.confirm('Delete this page?')) deletePage(page.id) }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
