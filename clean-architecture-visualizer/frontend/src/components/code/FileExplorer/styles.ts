import { styled } from '@mui/material/styles';

interface NodeContainerProps {
  isActive?: boolean;
  depth: number;
}

export const NodeContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'depth',
})<NodeContainerProps>(({ isActive, depth, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: depth * 16 + 12,
  paddingRight: 12,
  marginRight: 8,
  borderRadius: '0 20px 20px 0',
  fontWeight: isActive ? 600 : 400,
  cursor: 'pointer',
  backgroundColor: isActive ? theme.palette.primary.light : 'transparent',
  color: isActive ? theme.palette.primary.dark : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'all 0.15s ease-in-out',
}));

export const ExpandIconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  width: 20,
});

export const NodeLabel = styled('span')({
  marginLeft: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});