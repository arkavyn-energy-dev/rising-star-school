import { createContext, useCallback, useContext, useState } from "react";
import AdmissionModal from "../components/ui/AdmissionModal";

const AdmissionModalContext = createContext(null);

export function AdmissionModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAdmissionModal = useCallback(() => setIsOpen(true), []);
  const closeAdmissionModal = useCallback(() => setIsOpen(false), []);

  return (
    <AdmissionModalContext.Provider value={{ openAdmissionModal, closeAdmissionModal }}>
      {children}
      <AdmissionModal isOpen={isOpen} onClose={closeAdmissionModal} />
    </AdmissionModalContext.Provider>
  );
}

export function useAdmissionModal() {
  const ctx = useContext(AdmissionModalContext);
  if (!ctx) throw new Error("useAdmissionModal must be used within an AdmissionModalProvider");
  return ctx;
}
