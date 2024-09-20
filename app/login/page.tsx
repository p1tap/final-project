'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { Box, Container, Backdrop, CircularProgress } from '@mui/material';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <LoginForm onLoadingChange={setIsLoading} />
        </Box>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}