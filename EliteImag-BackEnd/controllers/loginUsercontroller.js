import loginUserSchema from "../models/loginUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  try {
    const users = await loginUserSchema.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await loginUserSchema.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email required.",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password required.",
      });
    }
    if (!username) {
      return res.status(400).json({
        status: "error",
        message: "Username required.",
      });
    }
    let exists = await loginUserSchema.findOne({ email });

    if (exists) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }
    const hash = bcrypt.hashSync(password, 10);

    const user = await loginUserSchema.create({
      email,
      password: hash,
      username,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email required.",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password required.",
      });
    }
    const user = await loginUserSchema.findOne({ email });
    if (!user) {
      return res.json({
        status: "error",
        error: "User does not exist",
      });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.json({
        status: "error",
        error: "Password does not match",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.username, // 👈 frontend name expect karta hai
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, currentPassword, newPassword } = req.body;

    // Find user
    const user = await loginUserSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Agar password change kar rahe hain
    if (newPassword) {
      // Current password verify karo
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      // New password hash karo
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update name and email
if (name) user.username = name;
    if (email) user.email = email;

    await user.save();

    // Password field ko response mein mat bhejo
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await loginUserSchema.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
