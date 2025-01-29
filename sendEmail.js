import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Temporarily allow all origins
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.GMAIL_USER,
        subject: "Ny kundehenvendelse",
        text: `Du har mottatt en melding fra ${name} (${email}):\n\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "E-posten ble sendt!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kunne ikke sende e-post." });
    }
}
