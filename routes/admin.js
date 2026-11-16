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

router.get("/change-password", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/change-password", {
    adminID: req.session.admin,
    error: null,
    success: null,
  });
});

router.post("/change-password", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");

  const { currentPassword, newPassword, confirmPassword } = req.body;
  const renderForm = (error, success = null) =>
    res.render("admin/change-password", {
      adminID: req.session.admin,
      error,
      success,
    });

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string" ||
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    return renderForm("Please complete all password fields.");
  }

  if (newPassword !== confirmPassword) {
    return renderForm("New password and confirmation do not match.");
  }

  try {
    const admin = await Admin.findOne({ adminID: req.session.admin });
    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      return renderForm("Current password is incorrect.");
    }

    admin.password = newPassword;
    await admin.save();
    return renderForm(null, "Password changed successfully.");
  } catch (error) {
    console.error("Error changing admin password:", error);
    return renderForm("Unable to change password. Please try again.");
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
