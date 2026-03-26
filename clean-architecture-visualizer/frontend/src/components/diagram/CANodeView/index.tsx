import { Typography } from '@mui/material';
import { NodePaper, type LayerColor } from './styles';
import type { CANode } from '../../../lib/types';

const layerColorMap: Record<CANode['layer'], LayerColor> = {
  EnterpriseBusinessRules: 'entities',
  ApplicationBusinessRules: 'useCases',
  InterfaceAdapters: 'adapters',
  Frameworks: 'drivers',
};

export function CANodeView(nodeObject: CANode) {
  const title = nodeObject.name ?? nodeObject.id;
  const layerColor = layerColorMap[nodeObject.layer] ?? 'adapters';

  return (
    <NodePaper layerColor={layerColor} status={nodeObject.status} data-ca-node-id={nodeObject.id}>
      <Typography variant="body1" align="center" fontWeight="bold">
        {title}
      </Typography>
    </NodePaper>
  );
}
