require("dotenv").config(); // Last inn miljøvariabler fra .env
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER, // Fra .env
            pass: process.env.GMAIL_PASS, // Fra .env
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
        res.status(200).send("E-posten ble sendt!");
    } catch (error) {
        console.error("Feil ved sending av e-post:", error);
        res.status(500).send("Kunne ikke sende e-post.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
