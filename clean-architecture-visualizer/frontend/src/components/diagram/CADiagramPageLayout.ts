import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const PageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
});

export const Workspace = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
});

export const MainViewContainer = styled('main')(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: theme.spacing(3),
}));