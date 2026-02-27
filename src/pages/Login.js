import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow p-4">
          <h3 className="text-center mb-3">Login</h3>
          <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
          <input className="form-control mb-3" name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button className="btn btn-primary w-100" onClick={handleSubmit}>Login</button>
          <p className="text-center mt-3">
            New user? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;