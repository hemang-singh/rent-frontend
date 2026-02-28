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
  const [filter, setFilter] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [userRole, setUserRole] = useState("buyer");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API || "http://localhost:5000";

  useEffect(() => {
    if (!token) navigate("/");

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setUserRole(user.role);
    }

    loadProperties();
  }, [navigate, token]);

  const loadProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/property`);
      setProperties(res.data);
    } catch (err) {
      alert("Error loading properties");
    }
  };

  const addProperty = async () => {
    if (!form.title || !form.location || !form.price || !form.contact || !form.type) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/property`, form, {
        headers: { Authorization: token },
      });

      setForm({
        title: "",
        location: "",
        price: "",
        contact: "",
        type: "",
        description: "",
        area: "",
      });

      loadProperties();
    } catch (err) {
      alert("Error adding property");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/property/${id}`, {
        headers: { Authorization: token },
      });
      loadProperties();
    } catch (err) {
      alert("You can delete only your own property");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredProperties = properties.filter((p) => {
    const price = Number(p.price);
    const minPrice = filter.minPrice ? Number(filter.minPrice) : 0;
    const maxPrice = filter.maxPrice ? Number(filter.maxPrice) : Infinity;

    if (
      filter.location &&
      !p.location.toLowerCase().includes(filter.location.toLowerCase())
    )
      return false;

    if (price < minPrice) return false;
    if (price > maxPrice) return false;

    return true;
  });

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      
      <style>{`
        .header {
          background-color: #1f2937;
          color: white;
        }

        .section-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .property-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: 0.2s ease;
        }

        .property-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }

        .label-title {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .property-value {
          font-size: 14px;
          color: #111827;
        }

        .property-price {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }
      `}</style>

      {/* Header */}
      <div className="header px-4 py-3 d-flex justify-content-between align-items-center">
        <h4 className="m-0">HouseHunt Dashboard</h4>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="container py-4">

        {/* Seller Section */}
        {userRole === "seller" && (
          <div className="section-card p-4 mb-4">
            <h5 className="mb-4">Add New Property</h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="label-title">Property Title</label>
                <input className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="label-title">Location</label>
                <input className="form-control"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="label-title">Price (INR)</label>
                <input type="number" className="form-control"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="label-title">Area (sq.ft)</label>
                <input type="number" className="form-control"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="label-title">Property Type</label>
                <select className="form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Flat</option>
                  <option>PG</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="label-title">Contact Information</label>
                <input className="form-control"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>

              <div className="col-md-12">
                <label className="label-title">Property Description</label>
                <textarea rows="3" className="form-control"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="col-md-12 text-end">
                <button className="btn btn-primary px-4" onClick={addProperty}>
                  Add Property
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buyer Filter */}
        {userRole === "buyer" && (
          <div className="section-card p-4 mb-4">
            <h5 className="mb-3">Search & Filter Properties</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="label-title">Location</label>
                <input className="form-control"
                  value={filter.location}
                  onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="label-title">Minimum Price</label>
                <input type="number" className="form-control"
                  value={filter.minPrice}
                  onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="label-title">Maximum Price</label>
                <input type="number" className="form-control"
                  value={filter.maxPrice}
                  onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Property Listing */}
        <h5 className="mb-3">Available Properties</h5>

        {filteredProperties.length === 0 ? (
          <div className="section-card p-4 text-center">
            No properties found based on your criteria.
          </div>
        ) : (
          <div className="row g-4">
            {filteredProperties.map((p) => (
              <div key={p._id} className="col-md-6 col-lg-4">
                <div className="property-card p-3 h-100">

                  <h6 className="fw-bold">{p.title}</h6>
                  <div className="property-price mb-2">₹ {p.price}</div>

                  <div className="mb-1">
                    <span className="label-title">Location: </span>
                    <span className="property-value">{p.location}</span>
                  </div>

                  <div className="mb-1">
                    <span className="label-title">Area: </span>
                    <span className="property-value">
                      {p.area ? `${p.area} sq.ft` : "Not specified"}
                    </span>
                  </div>

                  <div className="mb-1">
                    <span className="label-title">Property Type: </span>
                    <span className="property-value">{p.type}</span>
                  </div>

                  <div className="mb-1">
                    <span className="label-title">Contact: </span>
                    <span className="property-value">{p.contact}</span>
                  </div>

                  <div className="mt-2">
                    <span className="label-title">Description:</span>
                    <div className="property-value">
                      {p.description || "No description provided."}
                    </div>
                  </div>

                  <div className="mt-2 text-muted small">
                    Added by: {p.owner?.name}
                  </div>

                  {userRole === "seller" &&
                    p.owner?._id === userId && (
                      <button
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={() => deleteProperty(p._id)}
                      >
                        Delete Property
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
