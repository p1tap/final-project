"use client";
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
        <TextField
          placeholder="Search posts and users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          sx={{ mr: 2, backgroundColor: 'white', borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
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
}

export default Header;