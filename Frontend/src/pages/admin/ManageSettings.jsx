import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import PageHeader from "../../components/admin/PageHeader";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import { getSettings, updateSettings, testEmailSetup } from "../../services/settingsService";
import { getTestNotifyConfig } from "../../services/testAttemptService";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="font-heading font-bold text-primary text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}

function RepeatableRow({ onRemove, children }) {
  return (
    <div className="flex items-start gap-3 mb-3 bg-gray-50 rounded-lg p-3">
      <div className="flex-1 grid gap-2">{children}</div>
      <button type="button" onClick={onRemove} className="text-red-500 text-sm mt-1 flex-shrink-0">
        ✕
      </button>
    </div>
  );
}

export default function ManageSettings() {
  const { refreshSettings } = useSiteSettings();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loaded, setLoaded] = useState(false);
  const [notifyConfig, setNotifyConfig] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const statsArray = useFieldArray({ control, name: "stats" });
  const feeArray = useFieldArray({ control, name: "feeStructure" });
  const admissionArray = useFieldArray({ control, name: "admissionProcess" });
  const docsArray = useFieldArray({ control, name: "documentsRequired" });
  const valuesArray = useFieldArray({ control, name: "aboutContent.values" });
  const facilitiesArray = useFieldArray({ control, name: "facilities" });

  useEffect(() => {
    getSettings()
      .then((res) => {
        const data = res.data;
        reset({
          ...data,
          documentsRequired: (data.documentsRequired || []).map((v) => ({ value: v })),
        });
        setLoaded(true);
      })
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
    getTestNotifyConfig()
      .then((res) => setNotifyConfig(res.data))
      .catch(() => {});
  }, [reset]);

  const onSubmit = async (data) => {
    setAlert({ type: "", message: "" });
    try {
      const payload = {
        schoolName: data.schoolName,
        tagline: data.tagline,
        description: data.description,
        phone: data.phone,
        email: data.email,
        address: data.address,
        timings: data.timings,
        establishedYear: Number(data.establishedYear) || undefined,
        mapUrl: data.mapUrl,
        socialLinks: data.socialLinks,
        stats: (data.stats || []).map((s) => ({ ...s, value: Number(s.value) })),
        feeStructure: (data.feeStructure || []).filter((row) => row.grade?.trim()),
        admissionProcess: (data.admissionProcess || []).map((s) => ({ ...s, step: Number(s.step) })),
        documentsRequired: (data.documentsRequired || []).map((d) => d.value).filter(Boolean),
        programs: data.programs || [],
        whyChooseUs: data.whyChooseUs || [],
        facilities: data.facilities || [],
        aboutContent: data.aboutContent,
        academics: data.academics,
      };
      const res = await updateSettings(payload);
      await refreshSettings();
      reset({
        ...res.data,
        documentsRequired: (res.data.documentsRequired || []).map((v) => ({ value: v })),
      });
      setAlert({ type: "success", message: "Settings saved. Fee structure and other changes are now live on the website." });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to update settings." });
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setAlert({ type: "", message: "" });
    try {
      const res = await testEmailSetup();
      setAlert({ type: "success", message: res.message });
      getTestNotifyConfig().then((r) => setNotifyConfig(r.data)).catch(() => {});
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Email test failed." });
    } finally {
      setTestingEmail(false);
    }
  };

  if (!loaded) return <Loader label="Loading site settings..." />;

  return (
    <div>
      <PageHeader title="Site Settings" />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Section title="School Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>School Name</label>
              <input {...register("schoolName")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input {...register("tagline")} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea {...register("description")} rows={2} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input {...register("phone")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input {...register("email")} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <input {...register("address")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Timings</label>
              <input {...register("timings")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Established Year</label>
              <input {...register("establishedYear")} type="number" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Google Maps Embed URL</label>
              <input {...register("mapUrl")} className={inputClass} />
            </div>
          </div>
        </Section>

        <Section title="Social Links">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Facebook</label>
              <input {...register("socialLinks.facebook")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Twitter</label>
              <input {...register("socialLinks.twitter")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input {...register("socialLinks.instagram")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>YouTube</label>
              <input {...register("socialLinks.youtube")} className={inputClass} />
            </div>
          </div>
        </Section>

        <Section title="About Content">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>History</label>
              <textarea {...register("aboutContent.history")} rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Mission</label>
              <textarea {...register("aboutContent.mission")} rows={2} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Vision</label>
              <textarea {...register("aboutContent.vision")} rows={2} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Principal's Name</label>
                <input {...register("aboutContent.principalName")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Principal's Photo URL</label>
                <input {...register("aboutContent.principalPhoto")} placeholder="https://..." className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Principal's Message</label>
              <textarea {...register("aboutContent.principalMessage")} rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className={labelClass}>Director's Name</label>
                <input {...register("aboutContent.directorName")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Director's Photo URL</label>
                <input {...register("aboutContent.directorPhoto")} placeholder="https://..." className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Director's Message</label>
              <textarea {...register("aboutContent.directorMessage")} rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </Section>

        <Section title="Facilities">
          {facilitiesArray.fields.map((field, i) => (
            <RepeatableRow key={field.id} onRemove={() => facilitiesArray.remove(i)}>
              <div className="grid sm:grid-cols-4 gap-2">
                <input {...register(`facilities.${i}.icon`)} placeholder="Icon (emoji)" className={inputClass} />
                <input {...register(`facilities.${i}.title`)} placeholder="Title" className={inputClass} />
                <input {...register(`facilities.${i}.description`)} placeholder="Description" className={`${inputClass} sm:col-span-2`} />
              </div>
              <input {...register(`facilities.${i}.imageUrl`)} placeholder="Photo URL (optional)" className={`${inputClass} mt-2`} />
            </RepeatableRow>
          ))}
          <button
            type="button"
            onClick={() => facilitiesArray.append({ title: "", description: "", icon: "", imageUrl: "" })}
            className="text-accent-dark text-sm font-medium"
          >
            + Add Facility
          </button>
        </Section>

        <Section title="Core Values">
          {valuesArray.fields.map((field, i) => (
            <RepeatableRow key={field.id} onRemove={() => valuesArray.remove(i)}>
              <div className="grid sm:grid-cols-4 gap-2">
                <input {...register(`aboutContent.values.${i}.icon`)} placeholder="Icon" className={inputClass} />
                <input {...register(`aboutContent.values.${i}.title`)} placeholder="Title" className={`${inputClass} sm:col-span-1`} />
                <input {...register(`aboutContent.values.${i}.description`)} placeholder="Description" className={`${inputClass} sm:col-span-2`} />
              </div>
            </RepeatableRow>
          ))}
          <button type="button" onClick={() => valuesArray.append({ title: "", description: "", icon: "" })} className="text-accent-dark text-sm font-medium">
            + Add Value
          </button>
        </Section>

        <Section title="Homepage Stats">
          {statsArray.fields.map((field, i) => (
            <RepeatableRow key={field.id} onRemove={() => statsArray.remove(i)}>
              <div className="grid sm:grid-cols-3 gap-2">
                <input {...register(`stats.${i}.label`)} placeholder="Label" className={inputClass} />
                <input {...register(`stats.${i}.value`)} type="number" placeholder="Value" className={inputClass} />
                <input {...register(`stats.${i}.suffix`)} placeholder="Suffix (e.g. +)" className={inputClass} />
              </div>
            </RepeatableRow>
          ))}
          <button type="button" onClick={() => statsArray.append({ label: "", value: 0, suffix: "+" })} className="text-accent-dark text-sm font-medium">
            + Add Stat
          </button>
        </Section>

        <Section title="Fee Structure">
          <p className="text-sm text-gray-500 mb-4">
            Changes here appear on the public <strong>Admissions</strong> page fee table after you click Save.
          </p>
          {feeArray.fields.map((field, i) => (
            <RepeatableRow key={field.id} onRemove={() => feeArray.remove(i)}>
              <div className="grid sm:grid-cols-4 gap-2">
                <input {...register(`feeStructure.${i}.grade`)} placeholder="Grade" className={inputClass} />
                <input {...register(`feeStructure.${i}.admission`)} placeholder="Admission Fee" className={inputClass} />
                <input {...register(`feeStructure.${i}.tuition`)} placeholder="Tuition Fee" className={inputClass} />
                <input {...register(`feeStructure.${i}.annual`)} placeholder="Annual Charges" className={inputClass} />
              </div>
            </RepeatableRow>
          ))}
          <button
            type="button"
            onClick={() => feeArray.append({ grade: "", admission: "", tuition: "", annual: "" })}
            className="text-accent-dark text-sm font-medium"
          >
            + Add Fee Row
          </button>
        </Section>

        <Section title="Admission Process Steps">
          {admissionArray.fields.map((field, i) => (
            <RepeatableRow key={field.id} onRemove={() => admissionArray.remove(i)}>
              <div className="grid sm:grid-cols-4 gap-2">
                <input {...register(`admissionProcess.${i}.step`)} type="number" placeholder="Step #" className={inputClass} />
                <input {...register(`admissionProcess.${i}.title`)} placeholder="Title" className={inputClass} />
                <input {...register(`admissionProcess.${i}.description`)} placeholder="Description" className={`${inputClass} sm:col-span-2`} />
              </div>
            </RepeatableRow>
          ))}
          <button
            type="button"
            onClick={() => admissionArray.append({ step: admissionArray.fields.length + 1, title: "", description: "" })}
            className="text-accent-dark text-sm font-medium"
          >
            + Add Step
          </button>
        </Section>

        <Section title="Documents Required">
          {docsArray.fields.map((field, i) => (
            <RepeatableRow key={field.id} onRemove={() => docsArray.remove(i)}>
              <input {...register(`documentsRequired.${i}.value`)} placeholder="Document name" className={inputClass} />
            </RepeatableRow>
          ))}
          <button type="button" onClick={() => docsArray.append({ value: "" })} className="text-accent-dark text-sm font-medium">
            + Add Document
          </button>
        </Section>

        <Section title="Email Notifications (Gmail)">
          <p className="text-sm text-gray-600 mb-4">
            Student selection messages, admission alerts, and admin replies are sent from{" "}
            <strong>arkavyn.dev@gmail.com</strong> once Gmail App Password is configured in Backend/.env.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                notifyConfig?.emailConfigured ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
              }`}
            >
              Email: {notifyConfig?.emailConfigured ? "Configured" : "Not configured"}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                notifyConfig?.whatsappConfigured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              WhatsApp: {notifyConfig?.whatsappConfigured ? "Configured" : "Optional (Twilio)"}
            </span>
          </div>
          {!notifyConfig?.emailConfigured && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
              Run in Backend terminal:{" "}
              <code className="bg-white px-1 rounded">npm run email:setup YOUR_GMAIL_APP_PASSWORD</code>
            </p>
          )}
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testingEmail}
            className="btn-primary text-sm disabled:opacity-60"
          >
            {testingEmail ? "Sending test..." : "Send Test Email to Admin"}
          </button>
        </Section>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}
