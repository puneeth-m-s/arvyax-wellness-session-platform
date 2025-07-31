const Session = require("../models/Session");

const saveDraft = async (req, res) => {
  const userId = req.user.userId;
  const { sessionId, title, tags, json_file_url } = req.body;

  try {
    let session;
    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: userId },
        { title, tags, json_file_url, status: "draft", updated_at: new Date() },
        { new: true }
      );
    } else {
      session = new Session({ user_id: userId, title, tags, json_file_url });
      await session.save();
    }

    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sessions = await Session.find({ user_id: userId });
    res.status(200).json(sessions);
  } catch (err) {
    console.error("❌ Error fetching sessions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { saveDraft, getUserSessions };