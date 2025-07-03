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
import StudentClassPage from '@/feature/student/pages/studentClassPage';
import ProgramPage from '@/feature/master/pages/programPage';
import { BillingDataPage } from "@/feature/finance/pages/billingDataPage";
import { CreateInvoiceForm } from "@/feature/finance/components/CreateInvoiceForm";
import InvoiceDetailPage from "@/feature/finance/pages/InvoiceDetailPage";
import { PaymentDataPage } from "@/feature/payment/pages/PaymentDataPage";
import { CreatePaymentForm } from "@/feature/payment/components/CreatePaymentForm";
import { PrintPayment } from '@/feature/payment/components/PrintPayment';
import StudentsPage from '@/feature/student/pages/studentPage';


const AppRoutes = () => {
  const { user, loading } = useContext(AppContext);

  const ProtectedRoute = () => {
    const { user } = useContext(AppContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  };

  return (
    <BrowserRouter>
      {loading && <LoadingOverlay />}
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
          {/* <Route path="master/billing" element={<BillingPage />} /> */}
          <Route path="students/prospective" element={<ProspectiveStudentsPage />} />
          <Route path="students/prospective/create" element={<CreateProspectiveStudentsPage />} />
          <Route path="/students/student" element={<StudentsPage />} />
          <Route path="/students/classes" element={<StudentClassPage />} />
          <Route path="/students/program" element={<ProgramPage />} />
          <Route path="finance/billingData" element={<BillingDataPage />} />
          <Route path="finance/billingData/create" element={<CreateInvoiceForm />} />
          <Route path="finance/billingData/detail/:id" element={<InvoiceDetailPage />} />
          <Route path="payment/paymentData" element={<PaymentDataPage />} />
          <Route path="payment/paymentData/paymentForm" element={<CreatePaymentForm />} />
          <Route path="payment/paymentData/paymentForm/:id" element={<CreatePaymentForm />} />
          <Route path="payment/print" element={<PrintPayment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
