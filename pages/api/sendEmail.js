import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://jbuhs.no');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, company, message } = req.body;
        
        // Create transporter
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
        
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending email' });
    }
}