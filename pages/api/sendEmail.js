import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers directly
    res.setHeader('Access-Control-Allow-Origin', 'https://jbuhs.no');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, company, message } = req.body;
        
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        
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
            `
        });
        
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
}