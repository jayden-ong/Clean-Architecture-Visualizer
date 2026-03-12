import { Paper, styled } from '@mui/material';
import type { CANode } from '../../../lib/types';

export type LayerColor = 'entities' | 'useCases' | 'adapters' | 'drivers';

export const NodePaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'layerColor' && prop !== 'status',
})<{ layerColor: LayerColor; status: CANode['status'] }>(({ theme, layerColor, status }) => ({
  margin: theme.spacing(2),
  backgroundColor: theme.palette[layerColor].main,
  border: '2px solid',
  borderColor: theme.palette[layerColor].contrastText,
  color: theme.palette[layerColor].contrastText,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  ...(status === 'MISSING' && {
    borderStyle: 'dashed',
    opacity: 0.6,
  }),
  ...(status === 'VIOLATION' && {
    borderColor: theme.palette.error.main,
    borderWidth: 2,
  }),
}));
