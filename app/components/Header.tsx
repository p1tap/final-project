"use client";
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';


const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    // Reset navigation state when pathname changes
    setIsNavigating(false);
  }, [pathname]);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      const profilePath = `/profile/${user.id}`;
      if (pathname !== profilePath) {
        setIsNavigating(true);
        router.push(profilePath);
      }
    } else {
      console.error('User is not logged in');
      // Handle the case where user is null
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            component={Link}
            href="/"
          >
            <HomeIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              placeholder="Search posts and users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              sx={{ width: '50%', backgroundColor: 'white', borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }} component="span">{user.name}</Typography>
              <Box 
                onClick={handleProfileClick}
                sx={{ position: 'relative', mr: 2, cursor: 'pointer' }}
              >
                <Avatar 
                  src={user.profilePicture || undefined}
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  {!user.profilePicture && user.name[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    transform: 'translate(25%, 25%)',
                  }}
                >
                  <EditIcon sx={{ fontSize: 12 }} />
                </Box>
              </Box>
            </Box>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isNavigating}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
export default Header;