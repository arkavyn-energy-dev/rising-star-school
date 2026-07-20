import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdmissionBanner from "./AdmissionBanner";
import ScrollToTop from "./ScrollToTop";
import ScrollToTopOnNavigate from "./ScrollToTopOnNavigate";
import ScrollProgress from "./ScrollProgress";
import BackgroundFX from "../ui/BackgroundFX";
import SchoolChatBot from "../ui/SchoolChatBot";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <ScrollToTopOnNavigate />
      <ScrollProgress />
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdmissionBanner />
        <Navbar />
      </div>
      <main className="flex-1 pt-[96px] lg:pt-[108px]">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <SchoolChatBot />
    </div>
  );
}
