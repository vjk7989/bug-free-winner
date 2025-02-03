import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  attachments: Array<{
    filename: string;
    contentType: string;
    content: Buffer;
  }>;
  read: boolean;
}

class EmailService {
  private imapClient: ImapFlow;
  private smtpTransporter: nodemailer.Transporter;

  constructor() {
    // Initialize IMAP client for reading emails
    this.imapClient = new ImapFlow({
      host: process.env.IMAP_HOST || 'imap.gmail.com',
      port: Number(process.env.IMAP_PORT) || 993,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Initialize SMTP transporter for sending emails
    this.smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async fetchEmails(userEmail: string): Promise<Email[]> {
    try {
      await this.imapClient.connect();
      const lock = await this.imapClient.getMailboxLock('INBOX');

      const emails: Email[] = [];
      try {
        for await (const message of this.imapClient.fetch({ seen: false }, { source: true })) {
          const parsed = await simpleParser(message.source);
          
          // Only include emails sent to the user's registered email
          if (parsed.to?.text.includes(userEmail)) {
            emails.push({
              id: message.uid.toString(),
              from: parsed.from?.text || '',
              to: parsed.to?.text || '',
              subject: parsed.subject || '',
              body: parsed.text || '',
              date: parsed.date || new Date(),
              attachments: parsed.attachments.map(att => ({
                filename: att.filename || 'unnamed',
                contentType: att.contentType || 'application/octet-stream',
                content: att.content,
              })),
              read: false,
            });
          }
        }
      } finally {
        lock.release();
      }

      await this.imapClient.logout();
      return emails;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, body: string, attachments?: any[]) {
    try {
      await this.smtpTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: body,
        attachments,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService(); 