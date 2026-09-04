import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageProvider } from './context/PageContext';
import LoadingSpinner from './components/LoadingSpinner';

const Admin = lazy(() => import('./pages/Admin'));
const ClientPage = lazy(() => import('./pages/ClientPage'));

function App() {
  return (
    <PageProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/:clientPath" element={<ClientPage />} />
          </Routes>
        </Suspense>
      </Router>
    </PageProvider>
  );
}

export default App;
