import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography, Grid, LinearProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; 
import logo from "../../images/logo.png"; 
import "./diplome.css"

const Diplomes = () => {
  const [etudiant, setEtudiant] = useState({ nom: '', prenom: '', cin: '', email: '', annee: '', groupe: '' });
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const resetForm = () => {
    setEtudiant({ nom: '', prenom: '', cin: '', email: '', annee: '', groupe: '' });
    setShowQRCode(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/send-email', { etudiant });
      if (response.status === 200) {
        toast.success('Email envoyé avec succès');
        setShowQRCode(true);
        resetForm();
      } else {
        toast.error('Échec de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur :', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="centered-content">
        <img className="logo" src={logo} alt="logo" />
        <h2 className="title">Participation Journée Pré Intégration</h2>
      </div>

      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <form onSubmit={handleFormSubmit}>
            <Typography variant="h6" gutterBottom>
              Informations de l'étudiant(e)
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Nom" variant="outlined" fullWidth value={etudiant.nom} onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Prénom" variant="outlined" fullWidth value={etudiant.prenom} onChange={(e) => setEtudiant({ ...etudiant, prenom: e.target.value })} required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" variant="outlined" fullWidth value={etudiant.email} onChange={(e) => setEtudiant({ ...etudiant, email: e.target.value })} required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Année" variant="outlined" fullWidth value={etudiant.annee} onChange={(e) => setEtudiant({ ...etudiant, annee: e.target.value })} required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Groupe" variant="outlined" fullWidth value={etudiant.groupe} onChange={(e) => setEtudiant({ ...etudiant, groupe: e.target.value })} required />
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
            </Button>
            {loading && <LinearProgress />}
          </form>

          {showQRCode && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">QR Code pour {etudiant.nom} {etudiant.prenom}</Typography>
              <QRCodeSVG value={`Nom: ${etudiant.nom}, Prénom: ${etudiant.prenom}, ID: ID-${Math.random().toString(36).substr(2, 9)}`} size={128} />
            </Box>
          )}
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Diplomes;
