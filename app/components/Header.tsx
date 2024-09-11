"use client";
import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Header component rendered. User data:", user);
    if (user) {
      console.log("User profilePicture:", user.profilePicture);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    console.log("No user data in Header. Rendering null.");
    return null;
  }

  console.log("Rendering Header with user data:", {
    id: user.id,
    name: user.name,
    username: user.username,
    profilePicture: user.profilePicture
  });

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
              src={user.profilePicture || undefined}
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
              {!user.profilePicture && user.name[0]}
            </Avatar>
          </Link>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;