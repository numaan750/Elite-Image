import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { firstname, lastname, email, phone, option, message } = await req.json();

    // ✅ Sahi validation (phone aur option optional hain)
    if (!firstname || !lastname || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,  // ✅ Yeh line theek hai ab
      to: process.env.EMAIL_TO,
      subject: `Inquiry from EligiteImage by: ${firstname} ${lastname}`,
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Interest:</strong> ${option || 'Not selected'}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);  // ✅ Debugging ke liye
    return NextResponse.json(
      { success: false, message: "Email failed", error: error.message },
      { status: 500 }
    );
  }
}