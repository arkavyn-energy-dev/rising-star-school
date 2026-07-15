export default function ErrorMessage({ message = "Something went wrong. Please try again later." }) {
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">⚠️</p>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
