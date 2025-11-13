const nodemailer = require('nodemailer');
const logger = require('./logger');

// Email configuration using Gmail
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email service configuration error:', error);
  } else {
    logger.info('Email service is ready to send emails');
  }
});

// Email templates
const emailTemplates = {
  otpVerification: (firstName, otp) => ({
    subject: 'Investogold - Your Email Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; text-align: center; }
          .otp-code { font-size: 32px; font-weight: bold; color: #d97706; background: #fffbeb; padding: 20px; border-radius: 10px; margin: 20px 0; letter-spacing: 8px; border: 2px dashed #d97706; }
          .security-note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Investogold</h1>
            <p>Email Verification Required</p>
          </div>
          <div class="content">
            <h2>Hi ${firstName}!</h2>
            <p>Thank you for registering with Investogold. To complete your registration, please use the verification code below:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p><strong>Enter this 6-digit code on the verification page to activate your account.</strong></p>
            
            <div class="security-note">
              <h4>🛡️ Security Information:</h4>
              <ul style="text-align: left; display: inline-block;">
                <li>This code expires in <strong>10 minutes</strong></li>
                <li>You have <strong>5 attempts</strong> to enter the correct code</li>
                <li>Never share this code with anyone</li>
                <li>Investogold will never ask for your code via phone or email</li>
              </ul>
            </div>
            
            <p>If you didn't create an account with Investogold, please ignore this email and ensure your email account is secure.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Investogold. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  verification: (firstName, verificationLink) => ({
    subject: 'Verify Your Investogold Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Investogold</h1>
            <p>Welcome to the Future of Trading</p>
          </div>
          <div class="content">
            <h2>Hi ${firstName}!</h2>
            <p>Thank you for registering with Investogold. To complete your registration and start trading, please verify your email address.</p>
            <p>Click the button below to verify your account:</p>
            <a href="${verificationLink}" class="button">Verify My Account</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #d97706;">${verificationLink}</p>
            <p><strong>This verification link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with Investogold, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Investogold. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcome: (firstName) => ({
    subject: 'Welcome to Investogold - Your Trading Journey Begins!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Investogold</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; }
          .feature { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .button { display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Investogold!</h1>
            <p>Your account has been verified successfully</p>
          </div>
          <div class="content">
            <h2>Hi ${firstName}!</h2>
            <p>Congratulations! Your Investogold account is now active and ready for trading.</p>
            
            <h3>What's Next?</h3>
            <div class="feature">
              <h4>📊 Complete Your Profile</h4>
              <p>Add your trading preferences and complete your profile for a personalized experience.</p>
            </div>
            
            <div class="feature">
              <h4>💰 Make Your First Deposit</h4>
              <p>Fund your account and start trading with our advanced AI-powered trading bot.</p>
            </div>
            
            <div class="feature">
              <h4>🤝 Invite Friends</h4>
              <p>Share your referral link and earn commissions on multiple levels.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <p>If you have any questions, our support team is here to help you succeed!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Investogold. All rights reserved.</p>
            <p>Happy Trading!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (firstName, resetLink) => ({
    subject: 'Investogold - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .security-note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left; }
          .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
          .warning { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #842029; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Investogold</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hi ${firstName}!</h2>
            <p>We received a request to reset the password for your Investogold account.</p>
            <p>If you requested this password reset, click the button below to create a new password:</p>
            
            <a href="${resetLink}" class="button">Reset My Password</a>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #d97706; font-size: 12px;">${resetLink}</p>
            
            <div class="security-note">
              <h4>🛡️ Security Information:</h4>
              <ul>
                <li>This password reset link will expire in <strong>10 minutes</strong></li>
                <li>The link can only be used once</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your current password will remain unchanged unless you click the link above</li>
              </ul>
            </div>
            
            <div class="warning">
              <h4>⚠️ Didn't request this?</h4>
              <p>If you did not request a password reset, please ignore this email and ensure your account is secure. Consider changing your password if you suspect unauthorized access.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2025 Investogold. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>For support, contact us through your dashboard or our official support channels.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send OTP verification email
const sendOTPEmail = async (email, firstName, otp) => {
  try {
    const template = emailTemplates.otpVerification(firstName, otp);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`OTP verification email sent successfully to ${email}`, { messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Failed to send OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send verification email (legacy - keeping for backward compatibility)
const sendVerificationEmail = async (email, firstName, verificationToken) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const template = emailTemplates.verification(firstName, verificationLink);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent successfully to ${email}`, { messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const template = emailTemplates.welcome(firstName);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent successfully to ${email}`, { messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const template = emailTemplates.passwordReset(firstName, resetLink);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent successfully to ${email}`, { messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send generic email
const sendEmail = async (to, subject, html, text = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`, { subject, messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmail,
  transporter
};

