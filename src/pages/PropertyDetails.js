import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/property/${id}`)
      .then((res) => setProperty(res.data));
  }, [id]);

  if (!property) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>

      <div className="card p-4 shadow">
        <h2>{property.title}</h2>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Price:</strong> ₹{property.price}</p>
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
        <p><strong>Area:</strong> {property.area} sqft</p>
        <p><strong>Description:</strong> {property.description}</p>

        <hr />

        <h5>Owner Details</h5>
        <p><strong>Name:</strong> {property.owner?.name}</p>
        <p><strong>Email:</strong> {property.owner?.email}</p>
        <p><strong>Contact:</strong> {property.contact}</p>
      </div>
    </div>
  );
}

export default PropertyDetails;