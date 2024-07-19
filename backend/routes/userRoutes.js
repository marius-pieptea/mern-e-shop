const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Please enter all fields");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send("Email already exists");

  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.send(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter email and password");
  }

  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { _id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const userResponse = user.toObject();
      delete userResponse.password;
      res.send({ ...userResponse, token });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } else {
    res.status(401).send("Invalid email or password");
  }
});

router.put("/profile", auth, async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    // Check if the email is being changed and if it already exists in the database
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send("Email already exists");
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    // Check if the old password is correct before updating to the new password
    if (newPassword) {
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).send("Old password is incorrect");
      }
      user.password = bcrypt.hashSync(newPassword, 8);
    }

    await user.save();
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

//req pass reset route
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Reset Password",
      text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
            Please click on the following link to reset your password: \n\n
            ${process.env.CLIENT_URL}/reset-password/${resetToken}\n\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        res.status(400).send("Error sending email");
      } else {
        res.send("Password reset email sent");
      }
    });
  } else {
    res.status(404).send("User not found");
  }
});

//reset password route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (user) {
    user.password = bcrypt.hashSync(password, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.send("Password reset successful");
  } else {
    res.status(400).send("Password reset token is invalid or has expired");
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
