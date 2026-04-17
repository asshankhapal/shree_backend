const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_USER = "shankhapalakash@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_PASS || EMAIL_PASS === "123456789") {
  console.error(
    "\n╔══════════════════════════════════════════════════════════════╗" +
    "\n║  ⚠  SMTP ERROR: EMAIL_PASS is missing or is a placeholder  ║" +
    "\n║                                                              ║" +
    "\n║  Set a valid Gmail App Password in backend/.env              ║" +
    "\n║  Generate one at: https://myaccount.google.com/apppasswords  ║" +
    "\n║  Format: xxxx xxxx xxxx xxxx (16 chars, spaces optional)     ║" +
    "\n╚══════════════════════════════════════════════════════════════╝\n"
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify()
  .then(() => console.log("SMTP connection verified — mail service ready"))
  .catch((err) => console.error("SMTP connection failed:", err.message));

// Send OTP email (legacy support)
const sendOTP = async (options) => {
  const mailOptions = {
    from: `"Super Computers" <${EMAIL_USER}>`,
    to: options.email,
    subject: "Your Password Reset Code - Super Computers",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 4px; margin: 0;">Super Computers</h1>
          <p style="color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">Laptop Repair & Sales</p>
        </div>
        
        <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 30px; border-radius: 15px; text-align: center;">
          <h2 style="color: #ffffff; font-weight: 800;">Password Reset Code</h2>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 25px;">Use the 6-digit code below to reset your password.</p>
          
          <div style="background-color: #020617; border: 1px dashed #3b82f6; padding: 20px; font-size: 32px; font-weight: 900; color: #3b82f6; letter-spacing: 8px; margin: 20px 0; border-radius: 10px;">
            ${options.otp}
          </div>
          
          <p style="color: #ef4444; font-size: 11px; font-weight: bold; text-transform: uppercase;">This code expires in 10 minutes</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 20px;">
          <p style="color: #475569; font-size: 9px; text-transform: uppercase; letter-spacing: 1px;">Super Computers © 2024</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send reset link email
const sendResetLink = async ({ email, resetURL }) => {
  const mailOptions = {
    from: `"Super Computers" <${EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - Super Computers",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <div style="background-color: #020617; padding: 40px; text-align: center;">
             <div style="display: inline-block; background-color: #ffffff; padding: 12px; border-radius: 12px; margin-bottom: 20px;">
                <div style="color: #020617; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">S<span style="color: #2563eb;">C</span></div>
             </div>
             <h1 style="color: #ffffff; text-transform: uppercase; letter-spacing: 4px; margin: 0; font-size: 20px; font-weight: 800;">Super Computers</h1>
             <p style="color: #64748b; text-transform: uppercase; font-size: 9px; letter-spacing: 2px; margin-top: 8px;">Hardware Intelligence Node</p>
          </div>

          <div style="padding: 50px 40px; text-align: center;">
            <div style="text-align: left; margin-bottom: 35px;">
              <h2 style="color: #0f172a; font-size: 26px; font-weight: 800; margin-bottom: 15px; letter-spacing: -0.5px;">Protocol: Password Recovery</h2>
              <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0;">
                Our security layer received a request to re-establish access for your account. Please utilize the unique authentication link below to define your new credentials.
              </p>
            </div>

            <a href="${resetURL}" 
               style="display: block; background-color: #2563eb; color: #ffffff; padding: 20px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);">
              Reset Account Password
            </a>

            <div style="margin-top: 40px; padding: 25px; background-color: #f1f5f9; border-radius: 16px; text-align: left; border: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">Security Checksum:</p>
              <p style="color: #334155; font-size: 11px; word-break: break-all; margin: 0; font-family: monospace;">
                ${resetURL}
              </p>
            </div>

            <p style="color: #ef4444; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 30px; letter-spacing: 1px;">
              Expiration Window: 15 Minutes
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
              If you did not initiate this recovery protocol, please disregard this transmission. Access remains secure.
            </p>
            <div style="height: 1px; background-color: #e2e8f0; width: 40px; margin: 0 auto 20px;"></div>
            <p style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">Super Computers © 2024</p>
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send contact form email (to business + confirmation to customer)
const sendContactEmail = async ({ name, email, subject, message }) => {
  // 1. Notify the business
  const businessMail = {
    from: `"Super Computers" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    replyTo: email,
    subject: `[Contact Inquiry] ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 4px; margin: 0; font-size: 24px;">Super Computers</h1>
          <p style="color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-top: 4px;">New Contact Form Submission</p>
        </div>

        <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 30px; border-radius: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; padding: 12px 0 4px; vertical-align: top; width: 120px;">Name</td>
              <td style="color: #ffffff; font-size: 15px; font-weight: 600; padding: 12px 0 4px;">${name}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; padding: 12px 0 4px; vertical-align: top;">Email</td>
              <td style="color: #3b82f6; font-size: 15px; font-weight: 600; padding: 12px 0 4px;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; padding: 12px 0 4px; vertical-align: top;">Subject</td>
              <td style="color: #ffffff; font-size: 15px; font-weight: 600; padding: 12px 0 4px;">${subject}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e293b;">
            <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 10px;">Message</div>
            <div style="color: #cbd5e1; font-size: 14px; line-height: 1.7; white-space: pre-wrap; background-color: #020617; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">${message}</div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #1e293b;">
          <p style="color: #475569; font-size: 9px; text-transform: uppercase; letter-spacing: 1px;">Super Computers © 2024 — Contact Form Relay</p>
        </div>
      </div>
    `,
  };

  // 2. Confirmation email to the customer
  const confirmationMail = {
    from: `"Super Computers" <${EMAIL_USER}>`,
    to: email,
    subject: "We Received Your Inquiry - Super Computers",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 4px; margin: 0; font-size: 24px;">Super Computers</h1>
          <p style="color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-top: 4px;">Laptop Repair &amp; Sales</p>
        </div>

        <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 40px 30px; border-radius: 15px; text-align: center;">
          <h2 style="color: #ffffff; font-weight: 800; font-size: 22px; margin-bottom: 10px;">Thank You, ${name}!</h2>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 25px; line-height: 1.6;">
            We've received your inquiry regarding <strong style="color: #ffffff;">"${subject}"</strong> and our team will get back to you within 2 hours.
          </p>

          <div style="background-color: #020617; border: 1px solid #1e293b; padding: 20px; border-radius: 12px; text-align: left; margin-top: 20px;">
            <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 8px;">Your Message</div>
            <div style="color: #cbd5e1; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #1e293b;">
          <p style="color: #64748b; font-size: 11px; line-height: 1.5;">
            Need immediate help? Call us at <strong style="color: #ffffff;">+91 98765 43210</strong>
          </p>
          <p style="color: #475569; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">Super Computers © 2024</p>
        </div>
      </div>
    `,
  };

  await Promise.all([
    transporter.sendMail(businessMail),
    transporter.sendMail(confirmationMail),
  ]);
};

module.exports = { sendOTP, sendResetLink, sendContactEmail };
