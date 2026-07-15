// Floating-label input/textarea/select. The label rests large & low by
// default, and floats up (small, blue) when the field is focused OR already
// has a value — using the peer-focus and peer-[:not(:placeholder-shown)]
// variants so no JS state tracking is needed.
const fieldBase =
  "peer w-full px-4 pt-5 pb-2 rounded-xl border border-neutral-200 text-sm text-ink bg-white transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]";

const labelBase =
  "absolute left-4 top-3.5 text-neutral-400 text-sm transition-all duration-200 pointer-events-none " +
  "peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-accent " +
  "peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px]";

export function FloatingInput({ label, error, register, type = "text", as = "input", children, ...rest }) {
  // <select> has no CSS :placeholder-shown state, so its label stays
  // permanently floated (a selected option is always "present").
  if (as === "select") {
    return (
      <div>
        <div className="relative">
          <select {...register} {...rest} className={`${fieldBase} appearance-none`}>
            {children}
          </select>
          <label className="absolute left-4 top-1.5 text-[11px] text-neutral-400 pointer-events-none">{label}</label>
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        {as === "textarea" ? (
          <textarea {...register} placeholder=" " rows={rest.rows || 4} {...rest} className={`${fieldBase} pt-6 resize-none`} />
        ) : (
          <input type={type} {...register} placeholder=" " {...rest} className={fieldBase} />
        )}
        <label className={labelBase}>{label}</label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
}
