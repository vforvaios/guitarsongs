import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { registerUser } from "@/services/login";

interface RegisterForm {
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      enqueueSnackbar("Ο λογαριασμός δημιουργήθηκε επιτυχώς!", {
        variant: "success",
      });
      navigate("/login");
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || "Κάτι πήγε στραβά", {
        variant: "error",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Δημιουργία λογαριασμού</h1>
        <p>Συμπλήρωσε τα στοιχεία σου για να συνεχίσεις.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Τουλάχιστον 8 χαρακτήρες"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Δημιουργία..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          Έχεις ήδη λογαριασμό; <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
