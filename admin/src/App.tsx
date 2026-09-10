import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { LeadDetailPage } from '@/pages/LeadDetailPage';
import { LeadsPage } from '@/pages/LeadsPage';
import { LoginPage } from '@/pages/LoginPage';
import { QuotesPage } from '@/pages/QuotesPage';
import { RolesPage } from '@/pages/RolesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ResourceListPage } from '@/resources/ResourceListPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Config-driven CRUD resources */}
          <Route path="products" element={<ResourceListPage resourceKey="products" />} />
          <Route path="categories" element={<ResourceListPage resourceKey="categories" />} />
          <Route path="rooms" element={<ResourceListPage resourceKey="rooms" />} />
          <Route path="styles" element={<ResourceListPage resourceKey="styles" />} />
          <Route path="hero-slides" element={<ResourceListPage resourceKey="hero-slides" />} />
          <Route path="projects" element={<ResourceListPage resourceKey="projects" />} />
          <Route path="gallery" element={<ResourceListPage resourceKey="gallery" />} />
          <Route path="testimonials" element={<ResourceListPage resourceKey="testimonials" />} />
          <Route path="faqs" element={<ResourceListPage resourceKey="faqs" />} />
          <Route path="users" element={<ResourceListPage resourceKey="users" />} />

          {/* Custom pages */}
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/:id" element={<LeadDetailPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
