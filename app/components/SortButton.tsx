import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

interface SortButtonProps {
  sortOrder: 'newest' | 'oldest';
  onSortChange: (newSortOrder: 'newest' | 'oldest') => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onSortChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (newSortOrder: 'newest' | 'oldest') => {
    onSortChange(newSortOrder);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<SortIcon />}
        onClick={handleClick}
        sx={{ mb: 2 }}
      >
        Sort by: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSortChange('newest')}>Newest</MenuItem>
        <MenuItem onClick={() => handleSortChange('oldest')}>Oldest</MenuItem>
      </Menu>
    </>
  );
};

export default SortButton;