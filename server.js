const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors"); // Importer CORS

const app = express();

app.use(cors()); // Aktiver CORS for alle forespørsler
app.use(bodyParser.json());

// Rot-endepunkt for testing
app.get("/", (req, res) => {
    res.send("Serveren kjører! Du kan sende e-post via /send-email.");
});

// Endepunkt for å sende e-post
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // Bruk STARTTLS
        auth: {
            user: "jakob@buhs.no", // Din Outlook-e-post
            pass: "Skispor4421", // Ditt Outlook-passord eller app-passord
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: "jakob@buhs.no", // Din Outlook-e-post
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

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
