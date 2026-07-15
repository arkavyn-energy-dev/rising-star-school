import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { AdmissionModalProvider } from "./context/AdmissionModalContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <AdmissionModalProvider>
            <App />
          </AdmissionModalProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
