import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-20 space-y-4">
      <h1 className="text-3xl font-bold">Register</h1>
      <p>Registration is not implemented (no DB).</p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Login
      </button>
    </div>
  );
}
