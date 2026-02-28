import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, form);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow p-4">
          <h3 className="text-center mb-3">Register</h3>
          <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} />
          <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
          <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} />
          <select className="form-select mb-2" name="role" onChange={handleChange}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <button className="btn btn-success w-100" onClick={handleSubmit}>Register</button>
          <p className="text-center mt-3">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;