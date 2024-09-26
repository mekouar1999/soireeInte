const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', async (req, res) => {
  const { etudiant } = req.body;

  try {
    const uniqueId = `ID-${Math.random().toString(36).substr(2, 9)}`;
    const qrData = `Nom: ${etudiant.nom}, Prénom: ${etudiant.prenom}, Année: ${etudiant.annee}, Groupe: ${etudiant.groupe}, Identifiant unique: ${uniqueId}`;
    const qrDataURL = await QRCode.toDataURL(qrData);

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(255, 215, 0); // Gold color
    doc.text("Ecole Supérieure d'Ingénierie en Sciences Appliquées", 10, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text("Invitation à la Journée d'Intégration", 10, 30);
    
    doc.setFontSize(12);
    const today = new Date();
    const date = today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Date: ${date}`, 10, 40);
    
    const text = `Cher(e) ${etudiant.prenom} ${etudiant.nom},\n\nNous avons le plaisir de vous inviter à notre Journée d'Intégration qui se tiendra le 26 Septembre 2024 à l'ESISA. Ce sera une excellente occasion de rencontrer d'autres étudiants de la promotion ${etudiant.annee} du groupe ${etudiant.groupe} et aussi de toutes les promotions de l'école afin e vous intégrer un maximum au seins de l'établissement.\n\nVotre ID d'invitation est : ${uniqueId}\n\nNous avons hâte de vous voir parmi nous !`;
    const splitText = doc.splitTextToSize(text, 190);
    doc.setTextColor(0); // Black color for the main text
    doc.text(splitText, 10, 60);
    
    doc.addImage(qrDataURL, 'PNG', 10, 100, 50, 50);
    
    doc.setFontSize(10);
    doc.text("Cordialement,\nL'équipe administrative de l'ESISA", 10, 170);

    const pdfBuffer = doc.output('arraybuffer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'info@esisa.ac.ma',
      to: [etudiant.email, 'info@esisa.ac.ma'],
      subject: 'Invitation à la Journée d\'Intégration de l\'ESISA',
      text: `Bonjour ${etudiant.prenom},\n\nNous avons le plaisir de vous inviter à notre Journée d'Intégration qui se tiendra le [date de l'événement] à l'ESISA. Veuillez trouver ci-joint votre invitation.\n\nVotre ID d'invitation est : ${uniqueId}\n\nNous espérons vous voir nombreux et nous sommes impatients de vous accueillir !\n\nCordialement,\nL'équipe administrative de l'ESISA.`,
      attachments: [
        {
          filename: 'invitation.pdf',
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send(error.toString());
      }

      res.status(200).send('Email sent successfully');
    });

  } catch (error) {
    console.error('Error generating QR code or PDF:', error);
    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('Bonjour, vous êtes sur la page d\'accueil !');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
