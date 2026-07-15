import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FloatingInput } from "./FloatingField";
import SubmissionSuccess from "./SubmissionSuccess";
import { submitAdmissionEnquiry } from "../../services/admissionService";
import { saveLocalProof } from "../../utils/localProof";

const gradeOptions = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];

const enquirySchema = z.object({
  parentName: z.string().min(2, "Parent's name is required"),
  studentName: z.string().min(2, "Student's name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number"),
  grade: z.string().min(1, "Please select a grade"),
  message: z.string().optional(),
});

export default function AdmissionForm({ onSuccess, compact = false }) {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [confirmation, setConfirmation] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(enquirySchema) });

  const onSubmit = async (data) => {
    setSubmitStatus({ type: "", message: "" });
    try {
      const res = await submitAdmissionEnquiry(data);
      const referenceId = res.data?.referenceId;
      saveLocalProof({
        type: "Admission Enquiry",
        referenceId,
        studentName: data.studentName,
        grade: data.grade,
      });
      setConfirmation({
        parentName: data.parentName,
        referenceId,
      });
      reset();
      onSuccess?.();
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  if (confirmation) {
    return (
      <SubmissionSuccess
        title={`Thank You, ${confirmation.parentName}!`}
        message="Your admission enquiry has been received. A confirmation has also been sent to your email, SMS, and WhatsApp. Our admissions team will contact you soon."
        referenceId={confirmation.referenceId}
        note="Keep this reference ID handy for any follow-up with the school office."
        onDone={() => setConfirmation(null)}
        doneLabel="Submit Another Enquiry"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "space-y-4" : "space-y-5"}>
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingInput label="Parent's Name" register={register("parentName")} error={errors.parentName?.message} />
        <FloatingInput label="Student's Name" register={register("studentName")} error={errors.studentName?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingInput label="Email Address" type="email" register={register("email")} error={errors.email?.message} />
        <FloatingInput label="Phone Number" type="tel" register={register("phone")} error={errors.phone?.message} />
      </div>
      <FloatingInput label="Grade Applying For" as="select" register={register("grade")} error={errors.grade?.message}>
        <option value="" disabled>
          Select Grade
        </option>
        {gradeOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </FloatingInput>
      <FloatingInput label="Message (optional)" as="textarea" register={register("message")} />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? "Submitting..." : "Submit Enquiry →"}
      </button>

      {submitStatus.message && (
        <p className={`text-sm text-center ${submitStatus.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
          {submitStatus.message}
        </p>
      )}
    </form>
  );
}
