const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const emoji = require('node-emoji');  // Utilisation de node-emoji

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email-hackathon', async (req, res) => {
  const { participant } = req.body;
  console.log(participant);

  try {
    const uniqueId = `HACK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrData = `Nom: ${participant.nom}\nPrénom: ${participant.prenom}\nID: ${uniqueId}\nVille: ${participant.ville}\nLycée: ${participant.lycee}`;
    const qrDataURL = await QRCode.toDataURL(qrData);

    const doc = new jsPDF();

    // Titre principal
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(20);  // Réduit la taille du titre principal
    doc.text("INVITATION OFFICIELLE", 65, 40);
    
    // Ligne de séparation
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(1);
    doc.line(15, 45, 195, 45);
    
    // Sous-titre
    doc.setFontSize(14);  // Réduit la taille du sous-titre
    doc.setTextColor(0, 102, 204);
    doc.text("Hackathon ESISA 2025 - Confirmation de Participation", 35, 55);
    
    // Informations du participant
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.setFontSize(10);  // Réduit la taille pour les informations
    const today = new Date().toLocaleDateString('fr-FR');
    doc.text(`Date d'inscription : ${today}`, 15, 65);
doc.text(`Nom : ${participant.nom}   Prénom : ${participant.prenom}`, 15, 75);
doc.text(`Ville : ${participant.number}`, 15, 85);


    doc.text(`Ville : ${participant.ville}`, 15, 95);
    doc.text(`Lycée : ${participant.lycee}`, 15, 105);
    doc.text(`ID Unique : ${uniqueId}`, 15, 115);
    
    // Détails de l'événement
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(12);  // Réduit la taille pour les détails
    
    // Ajout du planning du hackathon
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);  // Réduit la taille du planning
    doc.text("Planning du Hackathon", 15, 130);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);  // Réduit la taille du texte du planning
    doc.text("09h00 - Accueil et enregistrement", 15, 140);
    doc.text("10h00 - Présentation du challenge", 15, 150);
    doc.text("12h00 - Début du coding", 15, 160);
    doc.text("13h00 - Pause déjeuner", 15, 170);
    doc.text("18h00 - Fin du coding et soumission", 15, 180);
    doc.text("", 15, 190);
    
    // Ajout des consignes spécifiques
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);  // Réduit la taille des consignes
    doc.text("Consignes Importantes", 15, 215);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);  // Réduit la taille du texte des consignes
    doc.text("Ordinateur portable mis à votre disposition au seins de l'établissement", 15, 225);
    doc.text("Une tenue correcte est exigée.", 15, 235);
    doc.text("Respectez les délais et les consignes des mentors.", 15, 245);
    doc.text("Amusez-vous et soyez créatifs !", 15, 255);
    
    // QR Code encadré
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(140, 130, 50, 50, 5, 5);
    doc.addImage(qrDataURL, 'PNG', 145, 135, 40, 40);
    
    // Ligne de séparation
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(15, 190, 195, 190);
    
    // Pied de page
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);  // Réduit la taille du pied de page
    doc.text("En participant, vous acceptez le traitement de vos données conformément au RGPD.", 15, 200);
    doc.setFont('helvetica', 'bold');
    doc.text("Contact : info@esisa.ac.ma | Site web : www.esisa.ac.ma", 15, 280);
    doc.text("LinkedIn : https://www.linkedin.com/school/esisa | Instagram : https://www.instagram.com/esisa.ac.ma/ ", 15, 290);
    
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
      to: [participant.email, 'info@esisa.ac.ma','esisa.ac.ma@gmail.com'],
      subject: 'Hackathon ESISA 2025 - Confirmation Officielle & Récompenses',
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #003366;">Félicitations, ${participant.prenom} !</h2>
        <p>Nous sommes ravis de vous accueillir au <strong>Hackathon ESISA 2025</strong>, une compétition où l'innovation et le talent seront récompensés.</p>
        
        <h3 style="color: #0066cc;">Détails de l'événement :</h3>
        <ul>
          <li><strong>Date :</strong> 30 Avril 2025</li>
          <li><strong>Heure :</strong> 14h00</li>
          <li><strong>Lieu :</strong> Campus ESISA, Fès</li>
          <li><strong>ID unique :</strong> <strong style="color: #0066cc;">${uniqueId}</strong></li>
        </ul>
    
        <h3 style="color: #d35400;">Récompenses :</h3>
        <ul>
          <li><strong>1ère place :</strong> 6000 DHS + Trophée</li>
          <li><strong>2ème place :</strong> 4500 DHS + Trophée</li>
          <li><strong>3ème place :</strong> 3000 DHS + Trophée</li>
        </ul>
        
        <p><strong>Votre invitation officielle</strong> est en pièce jointe avec un QR Code pour un accès rapide.</p>
    
        <h3 style="color: #27ae60;">Pourquoi ne pas rater cet événement ?</h3>
        <ul>
          <li>Une opportunité unique de montrer votre talent en développement et en innovation.</li>
          <li>Rencontrez des experts du domaine et élargissez votre réseau.</li>
          <li>Gagnez des prix, des trophées et boostez votre CV avec cette expérience prestigieuse.</li>
        </ul>
    
        <p><strong>Préparez-vous à innover et à impressionner !</strong></p>
        
        <p>Cordialement,</p>
        <p><strong>L'équipe ESISA</strong></p>
      </div>`,
      attachments: [
        {
          filename: 'Invitation_Hackathon_ESISA_2025.pdf',
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    };
    

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Erreur d\'envoi d\'email :', error);
        return res.status(500).send(error.toString());
      }

      res.status(200).send('Email envoyé avec succès');
    });

  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/', (req, res) => {
  res.send('Serveur Hackathon ESISA en ligne !');
});

app.listen(port, () => {
  console.log(`Serveur en cours sur http://localhost:${port}`);
});
