import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow p-4">
          <h3 className="text-center mb-3">Register</h3>
          <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} />
          <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
          <input className="form-control mb-3" name="password" type="password" placeholder="Password" onChange={handleChange} />
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