import React from 'react';
import { Container, Box, Typography, Link, Grid } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram, YouTube } from '@mui/icons-material';
import "./footer.css"
const Footer = () => {
  return (

    <>
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">



        <div className='footer' container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              ESISA
            </Typography>
            <Typography variant="body2">

Ecole Supérieure d'Ingénieurie en Sciences Appliquées            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">
              29 bis Avenue Ibn Khatib, Rte d'immouzzer
              <br />
              Fes , MAROC
              <br />
              Email: info@esisa.ac.ma
              <br />
              Téléphone: +212 5 35 65 70 95
            </Typography>
          </Grid>
   
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Suivez-nous
            </Typography>
            <Box>
              <Link href="https://web.facebook.com/profile.php?id=100069321947366" color="inherit" sx={{ mr: 1 }}>
                <Facebook />
              </Link>
              <Link href="https://www.youtube.com/@esisafesofficiel3275" color="inherit" sx={{ mr: 1 }}>
                <Twitter />
              </Link>
              <Link href="https://www.linkedin.com/school/esisa/mycompany/?viewAsMember=true" color="inherit" sx={{ mr: 1 }}>
                <YouTube />
              </Link>
              <Link href="https://www.instagram.com/esisa.ac.ma/?hl=fr" color="inherit">
                <Instagram />
              </Link>
            </Box>
          </Grid>
        </div>


      
      </Container>

     
    </Box>

     <Box mt={4}>
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} ESISA. Tous droits réservés.
          </Typography>
        </Box>
        </>
  );
  
};

export default Footer;
