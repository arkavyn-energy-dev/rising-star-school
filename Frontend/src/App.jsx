import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import Faculty from "./pages/Faculty";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import OnlineTests from "./pages/OnlineTests";
import TakeTest from "./pages/TakeTest";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageFaculty from "./pages/admin/ManageFaculty";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageTestimonials from "./pages/admin/ManageTestimonials";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageAdmissions from "./pages/admin/ManageAdmissions";
import ManageJobApplications from "./pages/admin/ManageJobApplications";
import ManageTestAttempts from "./pages/admin/ManageTestAttempts";
import ManageMessages from "./pages/admin/ManageMessages";
import ManageSubscribers from "./pages/admin/ManageSubscribers";
import ManageSettings from "./pages/admin/ManageSettings";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/online-test" element={<OnlineTests />} />
        <Route path="/online-test/:id" element={<TakeTest />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin panel (protected) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="faculty" element={<ManageFaculty />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
          <Route path="announcements" element={<ManageAnnouncements />} />
          <Route path="admissions" element={<ManageAdmissions />} />
          <Route path="careers" element={<ManageJobApplications />} />
          <Route path="test-attempts" element={<ManageTestAttempts />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="subscribers" element={<ManageSubscribers />} />
          <Route path="settings" element={<ManageSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
