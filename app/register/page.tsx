import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Header from '../components/Header';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <Box>
      <Header />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <RegisterForm />
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;