import nodemailer from "nodemailer";

/**
 * sendMail
 * - Safe mail sender
 * - Does NOT crash app if mail fails
 */
export async function sendMail({ to, subject, html }) {
  console.log("📧 sendMail called");
  console.log("➡️ TO:", to);
  console.log("➡️ SUBJECT:", subject);

  if (html && html.includes("Invalid Date")) {
    console.warn("⚠️ Email HTML contains Invalid Date");
  }

  // ✅ ENV CHECK
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASS) {
    console.error("❌ MAIL ENV MISSING");
    console.error("ADMIN_EMAIL or ADMIN_EMAIL_PASS not set");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Salon Admin" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Mail sent successfully:", info.messageId);
  } catch (err) {
    console.error("❌ Mail sending failed");
    console.error(err.message);
  }
}
