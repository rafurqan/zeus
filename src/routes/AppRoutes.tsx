import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

import LoginPage from '@/feature/authentication/pages/login';
import DashboardPage from '@/core/pages/dashboard';
import EducationLevelsPage from '@/core/pages/educationLevel';
import ProspectiveStudentsPage from '@/feature/prospective-student/pages/prospectiveStudentPage';
import LoadingOverlay from '@/core/components/ui/loading_screen';
import CreateProspectiveStudentsPage from '@/feature/prospective-student/pages/createProspectiveStudentPage';
import TeacherPage from '@/feature/teacher/pages/teacherPage';


const AppRoutes = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return <div >{loading && <LoadingOverlay />}</div>;
  }

  const ProtectedRoute = () => {
    const { user } = useContext(AppContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />

        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="master/education-levels" element={<EducationLevelsPage />} />
          <Route path="master/teachers" element={<TeacherPage />} />
          <Route path="students/prospective" element={<ProspectiveStudentsPage />} />
          <Route path="students/prospective/create" element={<CreateProspectiveStudentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
