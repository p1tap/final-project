"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  console.log("User object in Header:", user);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref legacyBehavior>
            <Typography
              component="a"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Social Media
            </Typography>
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 2 }} component="span">Welcome, {user.name}</Typography>
            <Link href={`/profile/${user.id}`} passHref>
              <Avatar 
                onClick={() => console.log("Clicking profile for user:", user)}
                sx={{ 
                  width: 40, 
                  height: 40, 
                  cursor: 'pointer',
                  mr: 2,
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                {user.name[0]}
              </Avatar>
            </Link>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;