import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/services/login";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.userLoggedIn);
      navigate("/admin");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-7 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-[#080808] mb-6">Σύνδεση</h2>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#c6371a]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:border-[#c6371a]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mutation.isError && (
            <p className="text-red-600 text-sm mb-4">
              {String(mutation.error)}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#c6371a] hover:bg-[#a92e17] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {mutation.isPending ? "Σύνδεση..." : "ΣΥΝΔΕΣΗ"}
          </button>
          <Link to="/register">Register</Link>
        </form>

        <p className="text-gray-500 text-center text-xs mt-8">
          Guitar Songs Admin
        </p>
      </div>
    </div>
  );
};

export default Login;
