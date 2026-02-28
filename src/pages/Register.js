import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/auth/register`, form);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed.");
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
        .register-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .register-title {
          font-weight: 600;
          color: #111827;
        }

        .form-label-custom {
          font-weight: 500;
          font-size: 14px;
          color: #374151;
        }

        .form-control:focus, .form-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .btn-success-custom {
          background-color: #16a34a;
          border: none;
        }

        .btn-success-custom:hover {
          background-color: #15803d;
        }
      `}</style>

      <div className="register-card shadow p-4">
        <h4 className="register-title text-center mb-4">
          Create Account
        </h4>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success py-2 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label form-label-custom">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label form-label-custom">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="mb-4">
            <label className="form-label form-label-custom">
              Register As
            </label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-success-custom w-100 py-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Already have an account? </span>
          <Link to="/" style={{ textDecoration: "none" }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
