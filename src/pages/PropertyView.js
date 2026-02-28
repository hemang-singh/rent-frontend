import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

function PropertyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property/${id}`);
        setProperty(res.data);
      } catch {
        alert("Property not found");
        navigate("/dashboard");
      }
    };
    loadProperty();
  }, [id, navigate]);

  if (!property) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-secondary mb-3">← Back</Link>
      <div className="card p-4 shadow">
        <h3>{property.title}</h3>
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Price:</strong> ₹{property.price}</p>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Area:</strong> {property.area}</p>
        <p><strong>Contact:</strong> {property.contact}</p>
        <p><strong>Description:</strong> {property.description || "N/A"}</p>
        <p className="text-muted"><em>Added by: {property.owner?.name}</em></p>
      </div>
    </div>
  );
}

export default PropertyView;