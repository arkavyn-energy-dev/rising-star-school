import FormModal from "./FormModal";
import AdmissionForm from "./AdmissionForm";

export default function AdmissionModal({ isOpen, onClose }) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      badge="Admissions Open 2026-27"
      title="Apply to Rising Star"
      subtitle="Fill in the details below and our admission team will reach out within 24 hours."
    >
      <AdmissionForm />
    </FormModal>
  );
}
