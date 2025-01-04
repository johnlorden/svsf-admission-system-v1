import nodemailer from 'nodemailer'
import { emailTemplates } from './emailTemplates'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  })
}

export async function sendApplicationStatusUpdate(to: string, status: string) {
  const subject = `Application Status Update`
  const html = emailTemplates.statusUpdate({ status })
  await sendEmail(to, subject, html)
}

export async function sendApplicationSubmissionConfirmation(to: string) {
  const subject = `Application Submitted Successfully`
  const html = emailTemplates.applicationSubmitted()
  await sendEmail(to, subject, html)
}

export async function sendApplicationApproved(to: string, studentName: string, gradeLevel: string, strand?: string) {
  const subject = `Application Approved`
  const html = emailTemplates.applicationApproved({ studentName, gradeLevel, strand })
  await sendEmail(to, subject, html)
}

export async function sendApplicationRejected(to: string, studentName: string, rejectionReason: string) {
  const subject = `Application Status Update`
  const html = emailTemplates.applicationRejected({ studentName, rejectionReason })
  await sendEmail(to, subject, html)
}

