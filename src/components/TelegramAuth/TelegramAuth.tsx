import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  Phone,
  Telegram,
  Login,
} from '@mui/icons-material';
import { 
  isTelegramWebApp,
  initTelegramWebApp,
  authenticateWithTelegram,
  getTelegramUser,
} from '../../utils/telegram-auth';
import { useAlert } from '../AlertSystem';
import MockAuthDialog from '../MockAuthDialog';

interface TelegramAuthProps {
  onAuthSuccess: (token: string, profile: any) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [authStep, setAuthStep] = useState<'checking' | 'need_phone' | 'ready' | 'desktop_auth'>('checking');
  const [showMockAuth, setShowMockAuth] = useState(false);
  const { showError, showInfo } = useAlert();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if we're in Telegram Web App
      if (!isTelegramWebApp()) {
        // Desktop'da - mock auth ko'rsatish
        console.log('🖥️ Desktop detected - showing mock auth');
        setAuthStep('desktop_auth');
        setLoading(false);
        return;
      }
      
      // Initialize Telegram Web App
      const isInitialized = initTelegramWebApp();
      if (!isInitialized) {
        setAuthStep('need_phone');
        setLoading(false);
        return;
      }
      
      // Try to authenticate
      const authResult = await authenticateWithTelegram();
      
      if (authResult) {
        onAuthSuccess(authResult.token, authResult.profile);
        setAuthStep('ready');
      } else {
        setAuthStep('need_phone');
      }
      
    } catch (error) {
      console.error('❌ [AUTH] Error during initialization:', error);
      showError('Autentifikatsiya xatosi', 'Xatolik');
      setAuthStep('need_phone');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegistration = () => {
    showInfo(
      `Iltimos, Telegram bot'ga /start buyrug'ini yuboring va telefon raqamingizni kiriting.\\\\n\\\\n` +
      `Keyin bu sahifani yangilab ko'ring.`,
      'Telefon raqam kerak'
    );
  };

  const handleMockAuth = (token: string, profile: any) => {
    onAuthSuccess(token, profile);
    setShowMockAuth(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', minWidth: 300 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Telegram Web App ishga tushirilmoqda...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Iltimos, kuting...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (authStep === 'need_phone') {
    const user = getTelegramUser();
    
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
        p={2}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
          <Telegram color="primary" sx={{ fontSize: 48, mb: 2 }} />
          
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Xush kelibsiz!
          </Typography>
          
          {user && (
            <Typography variant="body1" sx={{ mb: 3 }}>
              Salom, {user.firstName}! 👋
            </Typography>
          )}
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Dasturdan foydalanish uchun telefon raqamingizni tasdiqlash kerak.
          </Alert>
          
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Phone />}
              onClick={handlePhoneRegistration}
              fullWidth
            >
              Telefon raqamni tasdiqlash
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<Login />}
              onClick={initializeAuth}
            >
              Qayta urinish
            </Button>
          </Stack>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Faqat ro'yxatdan o'tgan managerlar kirishi mumkin
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (authStep === 'desktop_auth') {
    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="background.default"
          p={2}
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
            <Telegram color="primary" sx={{ fontSize: 48, mb: 2 }} />
            
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Desktop Manager Panel
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              Siz desktop'dan kirayotgansiz. Test uchun mock authentication ishlatiladi.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Production'da faqat Telegram bot orqali kirish mumkin.
            </Alert>
            
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Login />}
                onClick={() => setShowMockAuth(true)}
                fullWidth
              >
                Desktop Login
              </Button>
              
              <Typography variant="caption" color="text.secondary">
                Telefonda ishlatish uchun Telegram bot'dan foydalaning
              </Typography>
            </Stack>
          </Paper>
        </Box>
        
        <MockAuthDialog
          open={showMockAuth}
          onClose={() => setShowMockAuth(false)}
          onAuthSuccess={handleMockAuth}
        />
      </>
    );
  }

  if (authStep === 'ready') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', minWidth: 300 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Manager panel yuklanmoqda...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Iltimos, kuting...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default TelegramAuth;