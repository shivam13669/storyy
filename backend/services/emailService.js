import nodemailer from 'nodemailer';
import dns from 'dns';

// Force IPv4 DNS resolution
dns.setDefaultResultOrder('ipv4first');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectionUrl: undefined
});

/**
 * Send OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<Object>} Email send result
 */
export async function sendOTPEmail(email, otp) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #007bff;
          }
          .header h1 {
            color: #007bff;
            margin: 0;
          }
          .content {
            padding: 20px 0;
          }
          .otp-box {
            background-color: #f5f5f5;
            border-left: 4px solid #007bff;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 5px;
            margin: 10px 0;
          }
          .otp-expiry {
            color: #666;
            font-size: 14px;
            margin-top: 15px;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Stories by Foot</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>You requested a verification code to complete your action. Use the code below:</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666;">Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <div class="otp-expiry">This code expires in 5 minutes</div>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong> If you didn't request this code, please ignore this email. Do not share this code with anyone.
            </div>
            
            <p>Thank you,<br>Stories by Foot Team</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Stories by Foot. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Verification Code - Stories by Foot',
      html: htmlContent,
      text: `Your OTP verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return {
      success: true,
      message: 'OTP sent successfully',
      messageId: result.messageId,
    };
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}

/**
 * Verify email configuration by sending test email
 * @returns {Promise<boolean>} True if configuration is valid
 */
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email service is properly configured');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration failed:', error);
    return false;
  }
}
