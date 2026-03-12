import { Typography, Container, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CANodeView, Edge } from './index';
import type { CANode, CAComponentType, CALayer } from '../../lib/types';
import { useInteraction } from '../../actions/useAnalysis';

const componentLayerMap: Record<CAComponentType, CALayer> = {
    Controller: 'InterfaceAdapters',
    Presenter: 'InterfaceAdapters',
    View: 'Frameworks',
    ViewModel: 'InterfaceAdapters',
    InputBoundary: 'ApplicationBusinessRules',
    OutputBoundary: 'ApplicationBusinessRules',
    InputData: 'ApplicationBusinessRules',
    OutputData: 'ApplicationBusinessRules',
    Interactor: 'ApplicationBusinessRules',
    Entity: 'EnterpriseBusinessRules',
    DataAccessInterface: 'ApplicationBusinessRules',
    DataAccess: 'Frameworks',
    Database: 'Frameworks',
};

const getNodeByType = (nodes: CANode[], type: CAComponentType): CANode => {
    const node = nodes.find((candidate) => candidate.type === type);
    return (
        node ?? {
            id: `missing-${type}`,
            name: `${type} (Missing)`,
            type,
            layer: componentLayerMap[type],
            status: 'MISSING',
        }
    );
};

export function CADiagram() {
    const { interactionId } = useParams<{ interactionId: string }>();
    const {
        data: interactionData,
        isLoading,
        isError,
        error,
    } = useInteraction(interactionId ?? '');

    if (!interactionId) {
        return (
            <Container maxWidth="lg">
                <Typography color="error">Missing interaction id in URL.</Typography>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isError || !interactionData) {
        return (
            <Container maxWidth="lg">
                <Typography color="error">
                    {error instanceof Error ? error.message : 'Failed to load interaction data.'}
                </Typography>
            </Container>
        );
    }

    const nodes = interactionData.nodes ?? [];
    const edges = interactionData.edges ?? [];

    const controller = getNodeByType(nodes, 'Controller');
    const presenter = getNodeByType(nodes, 'Presenter');
    const viewModel = getNodeByType(nodes, 'ViewModel');
    const inputData = getNodeByType(nodes, 'InputData');
    const inputBoundary = getNodeByType(nodes, 'InputBoundary');
    const interactor = getNodeByType(nodes, 'Interactor');
    const outputBoundary = getNodeByType(nodes, 'OutputBoundary');
    const outputData = getNodeByType(nodes, 'OutputData');
    const dataAccessInterface = getNodeByType(nodes, 'DataAccessInterface');
    const entities = getNodeByType(nodes, 'Entity');
    const view = getNodeByType(nodes, 'View');
    const dataAccess = getNodeByType(nodes, 'DataAccess');
    const database = getNodeByType(nodes, 'Database');

    return (
        <><Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" gutterBottom>
                Clean Architecture Diagram
            </Typography>
            <Container sx={{ border: 2, borderColor: 'grey.600', borderRadius: 8, bgcolor: 'grey.100', py: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 2.1fr 1.1fr' }, gap: 2 }}>
                    <Box sx={{ border: 2, borderColor: 'adapters.contrastText', bgcolor: 'adapters.light', borderRadius: 2, p: 1.5 }}>
                        <Box sx={{ display: 'grid', gap: 1.5 }}>
                            <CANodeView {...controller} />
                            <CANodeView {...presenter} />
                            <CANodeView {...viewModel} />
                        </Box>
                    </Box>

                    <Box sx={{ border: 2, borderColor: 'useCases.contrastText', bgcolor: 'useCases.light', borderRadius: 2, p: 1.5 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                            <CANodeView {...inputData} />
                            <Box />
                            <CANodeView {...inputBoundary} />
                            <CANodeView {...interactor} />
                            <CANodeView {...outputBoundary} />
                            <Box />
                            <CANodeView {...outputData} />
                            <Box />
                            <Box />
                            <CANodeView {...dataAccessInterface} />
                        </Box>
                    </Box>

                    <Box sx={{ border: 2, borderColor: 'entities.contrastText', bgcolor: 'entities.light', borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%' }}>
                            <CANodeView {...entities} />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 2, borderTop: 2, borderColor: 'grey.600', pt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
                    <CANodeView {...view} />
                    <CANodeView {...dataAccess} />
                    <CANodeView {...database} />
                </Box>
            </Container>

            {edges.map((edge) => (
                <Edge key={edge.id} {...edge} />
            ))}
        </Container>
        </>
    );
}