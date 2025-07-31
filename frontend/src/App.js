// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SessionEditor from "./pages/SessionEditor";
import PublicSessions from "./pages/PublicSessions";
import Navbar from "./components/Navbar";
import SessionList from "./pages/SessionList";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicSessions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<SessionEditor />} />
        <Route path="/editor/:id" element={<SessionEditor />} />
        <Route path="/my-sessions" element={<SessionList />} />
      </Routes>
    </Router>
  );
}

export default App;