const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

// Serve login page
router.get("/login", (req, res) => {
  res.render("admin/admin-login", { error: null });
});

// Handle admin login
router.post("/login", async (req, res) => {
  const { adminID, password } = req.body;
  try {
    const admin = await Admin.findOne({ adminID });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.render("admin/admin-login", { error: "Invalid credentials" });
    }

    req.session.admin = adminID; // Store in session
    res.redirect("/admin");
  } catch (error) {
    res.render("admin/admin-login", { error: "Something went wrong" });
  }
});

// Admin Dashboard (Protected)
router.get("/", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/index", { adminID: req.session.admin });
});


// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
