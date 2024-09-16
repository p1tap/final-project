// app/login/page.tsx
import LoginForm from '../components/LoginForm';
import { Box, Container } from '@mui/material';

export default function LoginPage() {
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
          <LoginForm />
        </Box>
      </Container>
    </Box>
  );
}