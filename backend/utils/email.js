const nodemailer = require('nodemailer');

class EmailService {  constructor() {
    // Required environment variables
    const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_RECIPIENTS'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Missing email configuration:', missingVars.join(', '));
      console.warn('⚠️ Email notifications will be disabled');
      this.isConfigured = false;
      return;
    }

    // Initialize transport with retry capability
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000, // Minimum time between messages
      rateLimit: 5 // Max messages per rateDelta
    });

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        console.error('❌ Error verifying email configuration:', error);
        this.isConfigured = false;
      } else {
        console.log('✅ Email service ready');
        this.isConfigured = true;
      }
    });
  }

  // Format the email content with proper styling
  formatEmailContent(notice) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #8b5cf6, #a855f7); padding: 20px; border-radius: 8px; }
            .title { color: white; margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">${notice.title}</h1>
            </div>
            <div class="content">
              <p>${notice.description || notice.body}</p>
              ${notice.category ? `<p><strong>Category:</strong> ${notice.category}</p>` : ''}
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from UVCE Noticeboard.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Helper to validate email addresses
  validateEmails(emails) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every(email => emailRegex.test(email));
  }

  async sendNoticeEmail(notice, recipients = process.env.EMAIL_RECIPIENTS?.split(',')) {
    if (!this.isConfigured) {
      throw new Error('Email service is not properly configured');
    }

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients specified');
    }

    if (!this.validateEmails(recipients)) {
      throw new Error('Invalid email address format');
    }

    if (!notice.title) {
      throw new Error('Notice must have a title');
    }

    try {
      const mailOptions = {
        from: `UVCE Noticeboard <${process.env.EMAIL_USER}>`,
        to: recipients.join(','),
        subject: `New Notice: ${notice.title}`,
        html: this.formatEmailContent(notice)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Notice email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending notice email:', error);
      throw error;
    }
  }
}

const emailService = new EmailService();
module.exports = emailService;
