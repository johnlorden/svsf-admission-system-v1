import { compile } from 'handlebars'

export const emailTemplates = {
  otp: compile(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your OTP for SVSFI Enrollment</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: #ffffff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your OTP for SVSFI Enrollment</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for the SVSFI Enrollment System is:</p>
          <h2 style="text-align: center; font-size: 24px; padding: 10px; background-color: #e0e0e0;">{{otp}}</h2>
          <p>This OTP will expire in 10 minutes. Please use it to complete your enrollment process.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2023 St. Vincent School Foundation, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `),

  applicationApproved: compile(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Congratulations! Your Application is Approved</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: #ffffff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Congratulations!</h1>
        </div>
        <div class="content">
          <p>Dear {{studentName}},</p>
          <p>We are pleased to inform you that your application to St. Vincent School Foundation, Inc. has been approved!</p>
          <p>You have been accepted for the {{gradeLevel}} level{{#if strand}} in the {{strand}} strand{{/if}}.</p>
          <p>Please log in to your account on our enrollment system to view further instructions and complete the enrollment process.</p>
          <p>We look forward to welcoming you to our school community!</p>
        </div>
        <div class="footer">
          <p>&copy; 2023 St. Vincent School Foundation, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `),

  applicationRejected: compile(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Update on Your SVSFI Application</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: #ffffff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Update on Your SVSFI Application</h1>
        </div>
        <div class="content">
          <p>Dear {{studentName}},</p>
          <p>We regret to inform you that your application to St. Vincent School Foundation, Inc. has not been approved at this time.</p>
          <p>The admissions committee has provided the following feedback:</p>
          <p><em>{{rejectionReason}}</em></p>
          <p>We encourage you to consider reapplying in the future or exploring other educational opportunities that may better suit your needs.</p>
          <p>If you have any questions or would like further clarification, please don't hesitate to contact our admissions office.</p>
        </div>
        <div class="footer">
          <p>&copy; 2023 St. Vincent School Foundation, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `),

  resetPassword: compile(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your SVSFI Enrollment System Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: #ffffff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #003366; color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for the SVSFI Enrollment System. If you didn't make this request, you can ignore this email.</p>
          <p>To reset your password, please click the button below:</p>
          <p style="text-align: center;">
            <a href="{{resetLink}}" class="button">Reset Password</a>
          </p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you're having trouble with the button above, copy and paste the following link into your browser:</p>
          <p>{{resetLink}}</p>
        </div>
        <div class="footer">
          <p>&copy; 2023 St. Vincent School Foundation, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `),

  notification: compile(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SVSFI Enrollment System Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: #ffffff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SVSFI Notification</h1>
        </div>
        <div class="content">
          <p>Dear {{recipientName}},</p>
          <p>{{notificationMessage}}</p>
          <p>If you have any questions or need further information, please log in to your account or contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; 2023 St. Vincent School Foundation, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `)
}

