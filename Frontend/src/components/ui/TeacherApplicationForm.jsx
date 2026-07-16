import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FloatingInput } from "./FloatingField";
import SubmissionSuccess from "./SubmissionSuccess";
import { submitJobApplication } from "../../services/jobApplicationService";
import { saveLocalProof } from "../../utils/localProof";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number"),
  subjectSpecialization: z.string().min(2, "Please mention your subject specialization"),
  qualification: z.string().min(2, "Please mention your highest qualification"),
  experienceYears: z.string().optional(),
  message: z.string().optional(),
});

export default function TeacherApplicationForm() {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [confirmation, setConfirmation] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(applicationSchema) });

  const onSubmit = async (data) => {
    setSubmitStatus({ type: "", message: "" });
    try {
      const payload = { ...data, experienceYears: Number(data.experienceYears) || 0 };
      const res = await submitJobApplication(payload);
      const referenceId = res.data?.referenceId;
      saveLocalProof({
        type: "Teaching Application",
        referenceId,
        subjectSpecialization: data.subjectSpecialization,
      });
      setConfirmation({ fullName: data.fullName, referenceId });
      reset();
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
        title={`Thank You, ${confirmation.fullName}!`}
        message="Your teaching application has been received. A confirmation has also been sent to your email, SMS, and WhatsApp. Our HR team will review your profile and connect with you soon."
        referenceId={confirmation.referenceId}
        note="Keep this reference ID handy for any follow-up with the school office."
        onDone={() => setConfirmation(null)}
        doneLabel="Submit Another Application"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingInput label="Full Name" register={register("fullName")} error={errors.fullName?.message} />
        <FloatingInput label="Phone Number" type="tel" register={register("phone")} error={errors.phone?.message} />
      </div>
      <FloatingInput label="Email Address" type="email" register={register("email")} error={errors.email?.message} />
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingInput
          label="Subject Specialization"
          register={register("subjectSpecialization")}
          error={errors.subjectSpecialization?.message}
        />
        <FloatingInput label="Highest Qualification" register={register("qualification")} error={errors.qualification?.message} />
      </div>
      <FloatingInput
        label="Years of Teaching Experience"
        type="number"
        register={register("experienceYears")}
        error={errors.experienceYears?.message}
      />
      <FloatingInput label="Tell us about yourself (optional)" as="textarea" register={register("message")} />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? "Submitting..." : "Submit Application →"}
      </button>

      {submitStatus.message && (
        <p className={`text-sm text-center ${submitStatus.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
          {submitStatus.message}
        </p>
      )}
    </form>
  );
}
