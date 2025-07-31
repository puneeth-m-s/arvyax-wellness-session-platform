import React, { useEffect, useState } from "react";
import API from "../services/api";

function PublicSessions() {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error("Error loading public sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Explore Wellness Sessions 🧘
        </h1>

        {sessions.length === 0 ? (
          <p className="text-center text-gray-600">No published sessions yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <p className="text-sm mt-1 text-gray-500">
                  Tags: {session.tags.join(", ")}
                </p>
                <a
                  href={session.json_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-500 hover:underline text-sm"
                >
                  View JSON
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicSessions;
