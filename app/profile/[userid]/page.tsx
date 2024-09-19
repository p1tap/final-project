"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userid as string;
  const [echoedUserId, setEchoedUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log('Params:', params);
    console.log('UserId:', userId);

    fetch(`/api/echo/${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Echoed data:', data);
        setEchoedUserId(data.userId);
      })
      .catch(error => console.error('Error fetching echoed userId:', error));
  }, [params, userId]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">User Profile</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          User ID from params: {userId || 'Not available'}
        </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          User ID from echo API: {echoedUserId || 'Not available'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Params: {JSON.stringify(params)}
        </Typography>
      </Box>
    </Container>
  );
}