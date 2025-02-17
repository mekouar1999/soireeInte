import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography, Grid, LinearProgress, Checkbox, FormControlLabel } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; 
import logo from "../../images/logo.png"; 
import "./hackathon.css";

const Hackathon = () => {
  const [participant, setParticipant] = useState({ 
    nom: '', prenom: '', dateNaissance: '', lieuNaissance: '', ville: '', lycee: '', email: '' 
  });
  
  const [rgpdChecked, setRgpdChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Données des lycées par ville
  const lyceesByVille = {
    Fes: [
      { nom: "Lycée IPEP Fès", code: "ipep" },
      { nom: "Lycée Jabr", code: "jabr" },
      { nom: "Lycée Moulay Youssef", code: "moulay-youssef" },
      { nom: "Lycée Hassan II", code: "hassan-ii" },
      { nom: "Lycée Ibn Al Haytham", code: "ibn-al-haytham" },
      { nom: "Lycée Descartes", code: "descartes" },
    ],
    Casablanca: [
      { nom: "Lycée Lyautey", code: "lyautey" },
      { nom: "Lycée Jean de La Fontaine", code: "jean-de-la-fontaine" },
      { nom: "Lycée Al Jabr", code: "al-jabr" },
    ],
    Marrakech: [
      { nom: "Lycée Abdelmoumen", code: "abdelmoumen" },
      { nom: "Lycée Moulay Rachid", code: "moulay-rachid" },
    ],
    Tangier: [
      { nom: "Lycée Ibn Tofail", code: "ibn-tofail" },
      { nom: "Lycée Al Amal", code: "al-amal" },
    ],
    Rabat: [
      { nom: "Lycée Rabat Al Maarif", code: "rabat-al-maarif" },
      { nom: "Lycée Descartes", code: "descartes-rabat" },
    ],
  };

  const resetForm = () => {
    setParticipant({ nom: '', prenom: '', dateNaissance: '', lieuNaissance: '', ville: '', email: '', lycee: '' });
    setRgpdChecked(false);
    setShowQRCode(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3001/send-email-hackathon',
        { participant }
      );
      if (response.status === 200) {
        toast.success('Inscription réussie ! Un email de confirmation a été envoyé.');
        setShowQRCode(true);
        resetForm();
      } else {
        toast.error('Échec de l\'inscription.');
      }
    } catch (error) {
      console.error('Erreur :', error);
      toast.error('Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  const handleVilleChange = (e) => {
    const selectedVille = e.target.value;
    setParticipant({ ...participant, ville: selectedVille, lycee: '' });
  };

  return (
    <>
      <div className="centered-content">
        <img className="logo" src={logo} alt="logo" />
        <h2 className="title">Inscription au Hackathon de Développement</h2>
      </div>

      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <form onSubmit={handleFormSubmit}>
            <Typography variant="h6" gutterBottom>
              Informations du participant
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Nom" 
                  variant="outlined" 
                  fullWidth 
                  value={participant.nom} 
                  onChange={(e) => setParticipant({ ...participant, nom: e.target.value })} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Prénom" 
                  variant="outlined" 
                  fullWidth 
                  value={participant.prenom} 
                  onChange={(e) => setParticipant({ ...participant, prenom: e.target.value })} 
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Email" 
                  type="email" 
                  variant="outlined" 
                  fullWidth 
                  value={participant.email} 
                  onChange={(e) => setParticipant({ ...participant, email: e.target.value })} 
                  required 
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  type="date" 
                  label="Date de naissance" 
                  variant="outlined" 
                  fullWidth 
                  InputLabelProps={{ shrink: true }} 
                  value={participant.dateNaissance} 
                  onChange={(e) => setParticipant({ ...participant, dateNaissance: e.target.value })} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Lieu de naissance" 
                  variant="outlined" 
                  fullWidth 
                  value={participant.lieuNaissance} 
                  onChange={(e) => setParticipant({ ...participant, lieuNaissance: e.target.value })} 
                  required 
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  select
                  label="Ville" 
                  variant="outlined" 
                  fullWidth 
                  value={participant.ville} 
                  onChange={handleVilleChange} 
                  required
                  SelectProps={{ native: true }}
                >
                  <option value="">Sélectionnez une ville</option>
                  {Object.keys(lyceesByVille).map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  select
                  label="Nom du lycée" 
                  variant="outlined" 
                  fullWidth 
                  value={participant.lycee} 
                  onChange={(e) => setParticipant({ ...participant, lycee: e.target.value })}
                  required
                  SelectProps={{ native: true }}
                >
                  <option value="">Sélectionnez un lycée</option>
                  {lyceesByVille[participant.ville]?.map((lycee) => (
                    <option key={lycee.code} value={lycee.nom}>
                      {lycee.nom}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <FormControlLabel style={{marginTop:"2rem"}}
              control={<Checkbox checked={rgpdChecked} onChange={(e) => setRgpdChecked(e.target.checked)} />}
              label="J'atteste que mes données sont correctes et peuvent être utilisées pour cet événement."
            />

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading || !rgpdChecked}>
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </Button>
            {loading && <LinearProgress />}
          </form>

          {showQRCode && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">QR Code de confirmation</Typography>
              <QRCodeSVG value={`Nom: ${participant.nom}, Prénom: ${participant.prenom}, ID: ID-${Math.random().toString(36).substr(2, 9)}`} size={128} />
            </Box>
          )}
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Hackathon;
