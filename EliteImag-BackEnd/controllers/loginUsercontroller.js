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
      credits: 15,
    });
    console.log("✅ User created:", {
      _id: user._id,
      username: user.username,
      credits: user.credits,
    });
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      credits: user.credits,
    };

    res.status(201).json(userResponse);
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

    if (user.credits === undefined || user.credits === null) {
      user.credits = 15;
      await user.save();
      console.log("✅ Credits added to existing user:", user.email);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        credits: Number(user.credits) || 15,
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
        user.password,
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

export const deductCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { creditsToDeduct } = req.body;

    const user = await loginUserSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.credits < creditsToDeduct) {
      return res.status(400).json({
        message: "Insufficient credits",
        currentCredits: user.credits,
      });
    }
    user.credits -= creditsToDeduct;
    await user.save();

    res.status(200).json({
      message: "Credits deducted successfully",
      remainingCredits: user.credits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const googleLogin = async (req, res) => {
  try {
    const { email, username, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        status: "error",
        message: "Email and Google ID required.",
      });
    }

    let user = await loginUserSchema.findOne({ email });
    let isNewUser = false;

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      isNewUser = false;
    } else {
      user = await loginUserSchema.create({
        email,
        username: username || email.split("@")[0],
        googleId,
        credits: 15,
        password: null,
      });
      isNewUser = true;
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      status: "success",
      message: "Google login successful",
      token,
      isNewUser,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        credits: Number(user.credits) || 15,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
