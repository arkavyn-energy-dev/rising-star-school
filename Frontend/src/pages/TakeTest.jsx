import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import SubmissionSuccess from "../components/ui/SubmissionSuccess";
import { FloatingInput } from "../components/ui/FloatingField";
import { useFetch } from "../hooks/useFetch";
import { getTestById, submitTestAttempt } from "../services/testService";
import { saveLocalProof } from "../utils/localProof";

const detailsSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  studentClass: z.string().min(1, "Class is required"),
  parentName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number"),
});

export default function TakeTest() {
  const { id } = useParams();
  const { data: test, loading, error } = useFetch(() => getTestById(id), [id]);
  const [step, setStep] = useState("details");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(detailsSchema) });

  const onDetailsSubmit = (data) => {
    if (test?.className) data.studentClass = test.className;
    setStep("test");
  };

  const handleAnswer = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleFinalSubmit = async () => {
    setSubmitError("");
    const values = getValues();
    const answerArray = test.questions.map((_, i) => answers[i] ?? -1);

    if (answerArray.some((a) => a === -1)) {
      setSubmitError("Please answer all 30 questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitTestAttempt(id, {
        studentName: values.studentName,
        studentClass: test.className,
        parentName: values.parentName || "",
        email: values.email,
        phone: values.phone,
        answers: answerArray,
      });
      saveLocalProof({
        type: "Online Test",
        referenceId: res.data?.referenceId,
        studentName: values.studentName,
        grade: test.className,
      });
      setConfirmation({
        studentName: values.studentName,
        referenceId: res.data?.referenceId,
        score: res.data?.score,
        total: res.data?.totalQuestions,
      });
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading test..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!test) return <ErrorMessage message="Test not found." />;

  if (confirmation) {
    return (
      <section className="section-padding pt-32">
        <div className="container-custom max-w-lg">
          <SubmissionSuccess
            title={`Well Done, ${confirmation.studentName}!`}
            message="Your online screening test has been submitted at Rising Star Public School. A confirmation will be sent instantly to your email and WhatsApp number."
            referenceId={confirmation.referenceId}
            note={`Score: ${confirmation.score} / ${confirmation.total}. Please wait for the selection result — our team will contact you once the admin reviews your test.`}
            onDone={() => window.location.assign("/online-test")}
            doneLabel="Back to Tests"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding pt-28">
      <div className="container-custom max-w-3xl">
        <Link to="/online-test" className="text-accent text-sm font-medium hover:underline mb-6 inline-block">
          ← Back to all tests
        </Link>

        <div className="mb-8">
          <p className="text-accent text-xs font-semibold uppercase tracking-wide mb-1">{test.className}</p>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-ink mb-2">{test.title}</h1>
          <p className="text-ink/55 text-sm">{test.description}</p>
        </div>

        {step === "details" && (
          <form onSubmit={handleSubmit(onDetailsSubmit)} className="card-outline bg-white p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-ink mb-2">Student Details</h2>
            <FloatingInput label="Student's Full Name" register={register("studentName")} error={errors.studentName?.message} />
            <input type="hidden" {...register("studentClass")} value={test.className} />
            <div className="px-1">
              <p className="text-sm text-ink/50">
                Class: <span className="font-semibold text-ink">{test.className}</span>
              </p>
            </div>
            <FloatingInput label="Parent's Name (optional)" register={register("parentName")} error={errors.parentName?.message} />
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatingInput label="Email Address" type="email" register={register("email")} error={errors.email?.message} />
              <FloatingInput label="Phone / WhatsApp Number" type="tel" register={register("phone")} error={errors.phone?.message} />
            </div>
            <button type="submit" className="btn-primary w-full">
              Continue to Test →
            </button>
          </form>
        )}

        {step === "test" && (
          <div className="space-y-6">
            {test.questions.map((q, qi) => (
              <div key={qi} className="card-outline bg-white p-5">
                <p className="font-heading font-semibold text-ink mb-4">
                  <span className="text-accent mr-2">Q{qi + 1}.</span>
                  {q.questionText}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => handleAnswer(qi, oi)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        answers[qi] === oi
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-neutral-200 text-ink/70 hover:border-accent/30"
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}

            <button onClick={handleFinalSubmit} disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Test →"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
