// src/pages/SessionEditor.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SessionEditor = () => {
  const { id } = useParams(); // Get session ID from URL
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [jsonUrl, setJsonUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // "saving", "saved", "error"
  const [hasChanges, setHasChanges] = useState(false);
  
  // Refs to track initial values for change detection
  const initialValuesRef = useRef({ title: "", tags: "", jsonUrl: "" });
  const autoSaveTimerRef = useRef(null);

  // Load existing session data if editing
  useEffect(() => {
    if (id) {
      loadSessionData();
    }
  }, [id]);

  // Auto-save effect
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Only auto-save if there are changes and we have some content
    if (hasChanges && (title.trim() || tags.trim() || jsonUrl.trim())) {
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 5000); // 5 seconds
    }

    // Cleanup timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, tags, jsonUrl, hasChanges]);

  // Track changes
  useEffect(() => {
    const currentValues = { title, tags, jsonUrl };
    const initialValues = initialValuesRef.current;
    
    const changed = 
      currentValues.title !== initialValues.title ||
      currentValues.tags !== initialValues.tags ||
      currentValues.jsonUrl !== initialValues.jsonUrl;
    
    setHasChanges(changed);
  }, [title, tags, jsonUrl]);

  const loadSessionData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://localhost:5000/api/my-sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const sessions = await response.json();
      const session = sessions.find(s => s._id === id);
      
      if (session) {
        const loadedTitle = session.title || "";
        const loadedTags = session.tags ? session.tags.join(", ") : "";
        const loadedJsonUrl = session.json_file_url || "";
        
        setTitle(loadedTitle);
        setTags(loadedTags);
        setJsonUrl(loadedJsonUrl);
        
        // Set initial values for change detection
        initialValuesRef.current = {
          title: loadedTitle,
          tags: loadedTags,
          jsonUrl: loadedJsonUrl
        };
      }
    } catch (err) {
      console.error("Failed to load session:", err);
      alert("Failed to load session data");
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    setAutoSaveStatus("saving");
    
    const token = localStorage.getItem("token");
    const sessionData = {
      sessionId: id, // Include session ID for updates
      title,
      tags: tags.split(",").map((tag) => tag.trim()),
      json_file_url: jsonUrl,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/my-sessions/save-draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sessionData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAutoSaveStatus("saved");
        // Update initial values after successful save
        initialValuesRef.current = { title, tags, jsonUrl };
        setHasChanges(false);
        
        // Clear "saved" status after 2 seconds
        setTimeout(() => setAutoSaveStatus(""), 2000);
      } else {
        setAutoSaveStatus("error");
        console.error("❌ Auto-save error:", data);
        setTimeout(() => setAutoSaveStatus(""), 3000);
      }
    } catch (err) {
      setAutoSaveStatus("error");
      console.error("❌ Auto-save network error:", err);
      setTimeout(() => setAutoSaveStatus(""), 3000);
    }
  };

  const saveDraft = async () => {
    const token = localStorage.getItem("token");
    const sessionData = {
      sessionId: id, // Include session ID for updates
      title,
      tags: tags.split(",").map((tag) => tag.trim()),
      json_file_url: jsonUrl,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/my-sessions/save-draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sessionData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Draft saved successfully!");
        console.log("✅ Draft saved:", data);
        navigate("/dashboard"); // Redirect back to dashboard
      } else {
        alert("❌ Failed to save draft: " + data.message);
        console.error("❌ Error:", data);
      }
    } catch (err) {
      alert("❌ Network error");
      console.error("❌ Request failed:", err);
    }
  };

  const getAutoSaveStatusComponent = () => {
    switch (autoSaveStatus) {
      case "saving":
        return (
          <div className="flex items-center text-blue-600 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Auto-saving...
          </div>
        );
      case "saved":
        return (
          <div className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Auto-saved
          </div>
        );
      case "error":
        return (
          <div className="flex items-center text-red-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Auto-save failed
          </div>
        );
      default:
        return hasChanges ? (
          <div className="text-gray-500 text-sm">
            Unsaved changes (auto-save in 5s)
          </div>
        ) : null;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading session data...</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {id ? "Edit Session" : "Create New Session"}
        </h2>
        {getAutoSaveStatusComponent()}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Session Title"
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      <input
        type="text"
        value={jsonUrl}
        onChange={(e) => setJsonUrl(e.target.value)}
        placeholder="JSON File URL"
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      <div className="flex gap-2">
        <button
          onClick={saveDraft}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {id ? "Update & Close" : "Save & Close"}
        </button>
        
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        💡 Your changes are automatically saved every 5 seconds
      </div>
    </div>
  );
};

export default SessionEditor;