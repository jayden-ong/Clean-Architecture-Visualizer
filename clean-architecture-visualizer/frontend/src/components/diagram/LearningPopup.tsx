import { Paper, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CAComponentType } from '../../lib/types';
import { LAYER_METADATA, COMPONENT_TO_LAYER } from '../../lib/types';

interface LearningPopupProps {
    currentComponent?: CAComponentType;
}

export const LearningPopup = ({ currentComponent = 'Controller' }: LearningPopupProps) => {
    const { t } = useTranslation('learning');

    const toComponentKey = (component: CAComponentType) =>
        component.charAt(0).toLowerCase() + component.slice(1);
    
    // Convert PascalCase component type to camelCase for JSON keys
    const componentKey = toComponentKey(currentComponent);
    
    // Get the layer for this component and map to palette color
    const layer = COMPONENT_TO_LAYER[currentComponent];
    const paletteKey = LAYER_METADATA[layer].paletteKey;
    
    const diagramRelations = t(`components.${componentKey}.diagramRelations`, { returnObjects: true }) as string[];

    return (
        <Paper sx={{ width: '100%', height: '100%', overflowY: 'auto', borderRadius: theme => theme.shape.borderRadius, p: 2, pr: 0}}>
            <Box sx={{ width: '100%', height: 'fit-content', maxHeight: '100%', overflowY: 'auto', pr: 2}}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 2,
                        color: theme => theme.palette[paletteKey].main,
                        fontSize: 'clamp(1.1rem, 1.2rem + 0.8vw, 2.125rem)',
                        lineHeight: 1.2,
                        overflowWrap: 'anywhere',
                    }}
                >
                    {t(`components.${componentKey}.name`)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{t(`components.${componentKey}.description`)}</Typography>
                <ul>
                    {Array.isArray(diagramRelations) && diagramRelations.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </Box>
        </Paper>
    );
};


export default LearningPopup;