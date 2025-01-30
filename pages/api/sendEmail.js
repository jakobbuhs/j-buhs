import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, company, message } = req.body;

  // Enhanced logging of environment variables (mask the password)
  console.log('SMTP Configuration:', {
    user: process.env.SMTP_USER,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    contactEmail: process.env.CONTACT_EMAIL,
    passwordLength: process.env.SMTP_PASSWORD?.length
  });

  // Create a transporter with more explicit configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use STARTTLS
    requireTLS: true,
    tls: {
      ciphers: 'TLSv1.2',
      rejectUnauthorized: true
    },
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    debug: true, // Enable debugging
    logger: true // Use logging
  });

  try {
    // Verify transporter connection with timeout
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('Verification Error:', error);
          reject(error);
        } else {
          console.log('Server is ready to take our messages');
          resolve(success);
        }
      });
    });

    // Send email
    const mailOptions = {
      from: `"Website Contact" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: 'Ny kontaktforespørsel fra nettsiden',
      text: `
        Navn: ${name}
        Epost: ${email}
        Selskap: ${company}
        
        Melding:
        ${message}
      `,
      html: `
        <h3>Ny kontaktforespørsel</h3>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>Epost:</strong> ${email}</p>
        <p><strong>Selskap:</strong> ${company}</p>
        <h4>Melding:</h4>
        <p>${message}</p>
      `
    };

    // Send the email with additional logging
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Comprehensive Send Error:', {
            error: error,
            message: error.message,
            code: error.code,
            response: error.response
          });
          reject(error);
        } else {
          console.log('Email sent successfully:', info);
          resolve(info);
        }
      });
    });

    res.status(200).json({ 
      message: 'Email sent successfully', 
      success: true,
      info: info
    });
  } catch (error) {
    console.error('Final Catch Block Error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      fullError: error
    });

    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message,
      code: error.code,
      fullError: error
    });
  }
}