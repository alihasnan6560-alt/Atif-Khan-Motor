const express = require("express");
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_USER = "user";
const ADMIN_PASS = "user123";

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
