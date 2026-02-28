import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function MyListings() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/property/my/listings`, {
        headers: { Authorization: token },
      })
      .then((res) => setProperties(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>

      <h2>My Listings</h2>

      <div className="row">
        {properties.map((p) => (
          <div key={p._id} className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>{p.title}</h5>
              <p>₹{p.price}</p>
              <p>{p.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;