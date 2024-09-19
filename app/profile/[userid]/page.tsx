"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">User Profile</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          User ID: {userId || 'Not available'}
        </Typography>
      </Box>
    </Container>
  );
}