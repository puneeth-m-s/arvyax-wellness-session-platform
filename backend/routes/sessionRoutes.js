const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { getUserSessions, saveDraft } = require("../controllers/sessionController");

// Routes
router.get("/my-sessions", authenticateToken, getUserSessions);
router.post("/my-sessions/save-draft", authenticateToken, saveDraft); // for new draft
router.put("/my-sessions/:id", authenticateToken, saveDraft);         // for updating

module.exports = router;
