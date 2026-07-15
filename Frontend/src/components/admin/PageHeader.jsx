export default function PageHeader({ title, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-heading font-bold text-2xl text-primary">{title}</h1>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary text-sm !py-2.5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
