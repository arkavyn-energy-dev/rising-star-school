import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SectionHeading from "../components/ui/SectionHeading";
import Loader from "../components/ui/Loader";
import PageHero from "../components/ui/PageHero";
import { FloatingInput } from "../components/ui/FloatingField";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { submitContactMessage } from "../services/contactService";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[\d\s-]{7,15}$/.test(val), "Enter a valid phone number"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message is required"),
});

function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data) => {
    setSubmitStatus({ type: "", message: "" });
    try {
      const res = await submitContactMessage(data);
      setSubmitStatus({ type: "success", message: res.message });
      reset();
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-outline bg-white p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingInput label="Your Name" register={register("name")} error={errors.name?.message} />
        <FloatingInput label="Your Email" type="email" register={register("email")} error={errors.email?.message} />
      </div>
      <FloatingInput label="Phone Number (optional)" type="tel" register={register("phone")} error={errors.phone?.message} />
      <FloatingInput label="Subject" register={register("subject")} error={errors.subject?.message} />
      <FloatingInput label="Your Message" as="textarea" rows={5} register={register("message")} error={errors.message?.message} />
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? "Sending..." : "Send Message →"}
      </button>
      {submitStatus.message && (
        <p className={`text-sm text-center ${submitStatus.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
          {submitStatus.message}
        </p>
      )}
    </form>
  );
}

export default function Contact() {
  const { settings, loading } = useSiteSettings();

  if (loading) return <Loader />;

  const contactInfo = [
    { icon: "📍", label: "Address", value: settings?.address },
    { icon: "📞", label: "Phone", value: settings?.phone, href: `tel:${settings?.phone}` },
    { icon: "✉️", label: "Email", value: settings?.email, href: `mailto:${settings?.email}` },
    { icon: "🕐", label: "Timings", value: settings?.timings },
  ];

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us for any queries or information."
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <SectionHeading kicker="Reach Out" title="Get in Touch" center={false} />
              <p className="text-ink/60 mb-8 leading-relaxed">
                Have questions about admissions, academics, or anything else? Our team is here to help. Feel free
                to visit us or send us a message.
              </p>
              <div className="space-y-5 mb-8">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-ink text-sm">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-ink/60 text-sm hover:text-accent transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-ink/60 text-sm">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div>
                <p className="font-heading font-semibold text-ink text-sm mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {Object.entries(settings?.socialLinks || {}).map(([platform, url]) =>
                    url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 border border-neutral-200 hover:border-accent hover:text-accent text-ink rounded-full flex items-center justify-center transition-all duration-300 text-sm font-semibold"
                      >
                        {platform[0].toUpperCase()}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            </div>

            <div>
              <SectionHeading kicker="Say Hello" title="Send Us a Message" center={false} />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {settings?.mapUrl && (
        <section className="py-8">
          <div className="container-custom">
            <div className="rounded-2xl overflow-hidden border border-neutral-200">
              <iframe
                src={settings.mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
                className="w-full"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
