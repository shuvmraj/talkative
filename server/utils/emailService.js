const nodemailer = require('nodemailer');
require('dotenv').config();


// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send password recovery email
const sendPasswordRecoveryEmail = async (email, username, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Recovery - Talkative Chat App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Password Recovery</h2>
          <p>Hello ${username},</p>
          <p>You requested to recover your password for your Talkative Chat App account.</p>
          <p>Here is your password:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; font-size: 16px;">
            ${password}
          </div>
          <p>For security reasons, we recommend changing your password after logging in.</p>
          <p>If you did not request this password recovery, please secure your account immediately.</p>
          <p>Best regards,<br>The Talkative Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password recovery email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password recovery email:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Talkative Chat App!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Welcome to Talkative!</h2>
          <p>Hello ${username},</p>
          <p>Thank you for joining Talkative Chat App! We're excited to have you on board.</p>
          <p>With Talkative, you can:</p>
          <ul>
            <li>Connect with friends using their unique usernames</li>
            <li>Send real-time messages</li>
            <li>Customize your chat experience</li>
          </ul>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Happy chatting!</p>
          <p>Best regards,<br>The Talkative Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

module.exports = {
  sendPasswordRecoveryEmail,
  sendWelcomeEmail
};