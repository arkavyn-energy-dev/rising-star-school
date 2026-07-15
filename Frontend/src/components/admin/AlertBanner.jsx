export default function AlertBanner({ type = "success", message, onDismiss }) {
  if (!message) return null;

  const styles = type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className={`flex items-center justify-between border rounded-lg px-4 py-3 mb-4 text-sm ${styles}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 opacity-60 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}
