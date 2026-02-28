import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/auth/login`, form);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.user.id,
          role: res.data.user.role,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1f2937, #111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>{`
        .login-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .login-title {
          font-weight: 600;
          color: #111827;
        }

        .form-label-custom {
          font-weight: 500;
          font-size: 14px;
          color: #374151;
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .btn-primary-custom {
          background-color: #2563eb;
          border: none;
        }

        .btn-primary-custom:hover {
          background-color: #1d4ed8;
        }
      `}</style>

      <div className="login-card shadow p-4">
        <h4 className="login-title text-center mb-4">
          Account Login
        </h4>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label form-label-custom">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label form-label-custom">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">New user? </span>
          <Link to="/register" style={{ textDecoration: "none" }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
