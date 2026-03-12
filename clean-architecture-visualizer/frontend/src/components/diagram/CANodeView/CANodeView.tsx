import { Typography } from '@mui/material';
import { NodePaper, type LayerColor } from './CANodeView.styles';
import type { CANode } from '../../../lib/types';

const layerColorMap: Record<CANode['layer'], LayerColor> = {
  EnterpriseBusinessRules: 'entities',
  ApplicationBusinessRules: 'useCases',
  InterfaceAdapters: 'adapters',
  Frameworks: 'drivers',
};

export function CANodeView(nodeObject: CANode) {
  const title = nodeObject.name ?? nodeObject.id;
  const layerColor = layerColorMap[nodeObject.layer];

  return (
    <NodePaper layerColor={layerColor} status={nodeObject.status}>
      <Typography variant="body1" align="center" fontWeight="bold">
        {title}
      </Typography>
    </NodePaper>
  );
}