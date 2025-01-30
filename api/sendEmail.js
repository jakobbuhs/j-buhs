import nodemailer from 'nodemailer';
import cors from 'cors';

// Configure CORS middleware
const corsMiddleware = cors({
  origin: ['https://jbuhs.no', 'http://localhost:3000'], // Add your frontend domains
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
});

export default async function handler(req, res) {
    // Handle CORS
    await new Promise((resolve, reject) => {
        corsMiddleware(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, company, message } = req.body;
        
        // Create transporter using GoDaddy SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        
        // Send email
        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL,
            to: process.env.CONTACT_EMAIL,
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
            `,
        });
        
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
}