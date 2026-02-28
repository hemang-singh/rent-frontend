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
    area: "",
  });

  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState({ location: "", minPrice: "", maxPrice: "" });
  const [userRole, setUserRole] = useState("buyer");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API || "http://localhost:5000";

  useEffect(() => {
    if (!token) navigate("/");

    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setUserRole(user.role);
    }

    loadProperties();
  }, [navigate, token]);

  // Load properties from backend
  const loadProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/property`);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading properties");
    }
  };

  // Add property (sellers only)
  const addProperty = async () => {
    if (!form.title || !form.location || !form.price || !form.contact || !form.type) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/property`, form, {
        headers: { Authorization: token },
      });
      setForm({ title: "", location: "", price: "", contact: "", type: "", description: "", area: "" });
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
      await axios.delete(`${API_URL}/api/property/${id}`, { headers: { Authorization: token } });
      loadProperties();
    } catch (err) {
      alert("You can delete only your own property");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Filter properties (fixed numeric comparison)
  const filteredProperties = properties.filter((p) => {
    const price = Number(p.price); // ensure numeric
    const minPrice = filter.minPrice ? Number(filter.minPrice) : 0;
    const maxPrice = filter.maxPrice ? Number(filter.maxPrice) : Infinity;

    if (filter.location && !p.location.toLowerCase().includes(filter.location.toLowerCase())) return false;
    if (price < minPrice) return false;
    if (price > maxPrice) return false;

    return true;
  });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">HouseHunt Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
      </div>

      {/* Add Property Form (sellers only) */}
      {userRole === "seller" && (
        <div className="card shadow-lg p-4 mb-4 rounded">
          <h5 className="mb-3 text-secondary">Add New Property</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input className="form-control" name="title" placeholder="Property Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="location" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="number" name="price" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="contact" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div className="col-md-3 mt-2">
              <select className="form-select" name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="PG">PG</option>
                <option value="Flat">Flat</option>
              </select>
            </div>
            <div className="col-md-3 mt-2">
              <input className="form-control" type="number" name="area" placeholder="Area (sq.ft)" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
            <div className="col-md-9 mt-2">
              <textarea className="form-control" name="description" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
            </div>
            <div className="col-md-2 mt-2">
              <button className="btn btn-success w-100" onClick={addProperty}>Add Property</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar (buyers only) */}
      {userRole === "buyer" && (
        <div className="card shadow-sm p-3 mb-4 rounded">
          <h5 className="mb-3 text-secondary">Filter Properties</h5>
          <div className="row g-2">
            <div className="col-md-4">
              <input className="form-control" placeholder="Location" value={filter.location} onChange={(e) => setFilter({ ...filter, location: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" placeholder="Min Price" value={filter.minPrice} onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" placeholder="Max Price" value={filter.maxPrice} onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {/* Property List */}
      <h5 className="mb-3 text-secondary">All Properties</h5>
      {filteredProperties.length === 0 && <p className="text-muted">No properties found.</p>}
      <div className="row">
        {filteredProperties.map((p) => (
          <div key={p._id} className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-primary">{p.title}</h5>
                <span className="badge bg-info text-dark">{p.type}</span>
              </div>
              <p><strong>Price:</strong> ₹{p.price}</p>
              <p><strong>Location:</strong> {p.location}</p>
              <p><strong>Area:</strong> {p.area || "N/A"} sq.ft</p>
              <p><strong>Contact:</strong> {p.contact}</p>
              <p><strong>Description:</strong> {p.description || "N/A"}</p>
              <p className="text-muted"><em>Added by: {p.owner?.name}</em></p>
              {userRole === "seller" && p.owner?._id === userId && (
                <button className="btn btn-danger btn-sm mt-2" onClick={() => deleteProperty(p._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;