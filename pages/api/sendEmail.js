import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, company, message } = req.body;

    // Enhanced logging of configuration
    console.log('SMTP Configuration:', {
      user: process.env.SMTP_USER,
      fromEmail: process.env.SMTP_FROM_EMAIL,
      contactEmail: process.env.CONTACT_EMAIL
    });

    // Create transporter with enhanced security settings
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        }
    });

    // Verify connection before sending
    await transporter.verify();

    // Send email with enhanced formatting
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Ny kontaktforespørsel fra ${name}`,
      text: `
        Navn: ${name}
        E-post: ${email}
        Bedrift: ${company}
        
        Melding:
        ${message}
      `,
      html: `
        <h2>Ny kontaktforespørsel</h2>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Bedrift:</strong> ${company}</p>
        <p><strong>Melding:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.status(200).json({ 
      message: 'Email sent successfully',
      success: true
    });
  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      response: error.response
    });

    res.status(500).json({ 
      message: 'Error sending email',
      error: error.message
    });
  }
}