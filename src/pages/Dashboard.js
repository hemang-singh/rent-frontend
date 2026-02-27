import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    contact: "",
    type: "",
    description: "",
  });

  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
    loadProperties();
  }, [navigate, token]);

  // Load all properties
  const loadProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/property");
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add new property
  const addProperty = async () => {
    if (!form.title || !form.location || !form.price || !form.contact || !form.type) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/property", form, {
        headers: { Authorization: token },
      });
      setForm({ title: "", location: "", price: "", contact: "", type: "", description: "" });
      loadProperties();
    } catch (err) {
      console.error(err);
      alert("Error adding property");
    }
  };

  // Delete property (only owner)
  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/property/${id}`, { headers: { Authorization: token } });
      loadProperties();
    } catch (err) {
      alert("You can only delete your own property");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">House Rent Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
      </div>

      {/* Add Property Form */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3 text-secondary">Add New Property</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" name="title" placeholder="Property Title" value={form.title} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input className="form-control" type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="contact" placeholder="Contact (phone/email)" value={form.contact} onChange={handleChange} />
          </div>
          <div className="col-md-3 mt-2">
            <select className="form-select" name="type" value={form.type} onChange={handleChange}>
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="PG">PG</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div className="col-md-9 mt-2">
            <textarea className="form-control" name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea>
          </div>
          <div className="col-md-2 mt-2">
            <button className="btn btn-success w-100" onClick={addProperty}>Add Property</button>
          </div>
        </div>
      </div>

      {/* Property List */}
      <h5 className="mb-3 text-secondary">All Properties</h5>
      {properties.length === 0 && <p className="text-muted">No properties added yet.</p>}
      <div className="row">
        {properties.map((p) => (
          <div key={p._id} className="col-md-6">
            <div className="card mb-3 shadow-sm hover-shadow" style={{ transition: "0.3s" }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{p.title}</h5>
                  <span className="badge bg-info text-dark">{p.type}</span>
                </div>
                <p className="mb-1"><strong>Location:</strong> {p.location}</p>
                <p className="mb-1"><strong>Price:</strong> ₹{p.price}</p>
                <p className="mb-1"><strong>Contact:</strong> {p.contact}</p>
                <p className="mb-1"><strong>Description:</strong> {p.description}</p>
                <p className="mb-1 text-muted"><em>Property added by ~ {p.owner?.name || "Unknown"}</em></p>
                <button className="btn btn-sm btn-danger mt-2" onClick={() => deleteProperty(p._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;