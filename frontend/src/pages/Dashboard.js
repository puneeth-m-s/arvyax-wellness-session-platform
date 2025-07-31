import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    try {
      const res = await API.get("/my-sessions");
      setSessions(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions. Please log in again.");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wellness Sessions</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={() => navigate("/editor")}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Create New Session
      </button>

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{session.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Status:{" "}
                <span
                  className={
                    session.status === "published"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {session.status}
                </span>
              </p>
              <p className="text-sm mt-2">
                Tags: {session.tags && session.tags.join(", ")}
              </p>
              <button
                onClick={() => navigate(`/editor/${session._id}`)}
                className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
