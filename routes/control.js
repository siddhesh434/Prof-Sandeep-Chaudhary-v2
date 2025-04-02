const express = require("express");
const router = express.Router();
const Visibility = require("../models/Visibility");

router.get("/admin/control.html", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("admin/control", { adminID: req.session.admin });
});

router.post("/admin/update-settings", async (req, res) => {
  try {
    const { settings } = req.body;
    const updatedSettings = await Visibility.findOneAndUpdate({}, settings, {
      upsert: true,
      new: true,
    });
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving settings" });
  }
});

router.get("/admin/get-settings", async (req, res) => {
  try {
    const settings = (await Visibility.findOne()) || {};
    console.log(settings);
    res.json({ success: true, settings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching settings" });
  }
});

module.exports = router;
