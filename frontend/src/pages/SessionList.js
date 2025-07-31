// src/pages/SessionList.js
import React, { useEffect, useState } from "react";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/my-sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          setSessions(data);
        } else {
          console.error("❌ Failed to fetch sessions:", data.message);
        }
      } catch (err) {
        console.error("❌ Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Draft Sessions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li
              key={session._id}
              className="border border-gray-300 rounded-lg p-4 shadow"
            >
              <h3 className="text-lg font-semibold">{session.title}</h3>
              <p><strong>Tags:</strong> {session.tags.join(", ")}</p>
              <p><strong>JSON URL:</strong> {session.json_file_url}</p>
              <p><strong>Status:</strong> {session.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionList;
