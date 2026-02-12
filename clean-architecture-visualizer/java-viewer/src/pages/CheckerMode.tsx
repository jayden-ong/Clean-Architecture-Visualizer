import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/config';
import { Link } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { HomeIcon, InfoIcon, CheckCircleIcon, ErrorIcon } from '../assets/icons';

// TODO: delete dummy data for use cases and interactions once endpoint is settled
const dummyUseCases = [
    {
        name: 'Sign In',
        interactions: [
            { id: '1', name: 'Sign In' },
        ],
    },
    {
        name: 'Sign Out',
        interactions: [
            { id: '2', name: 'Sign Out' },
        ],
    },
    {
        name: 'Multi-Factor Authentication',
        interactions: [
            { id: '3', name: 'Initiate Authentication' },
            { id: '4', name: 'Confirm Authentication' },
        ],
    },
    {
        name: 'Use Case #4',
        interactions: [],
    },
    {
        name: 'Use Case #5',
        interactions: [],
    },
];


const CheckerMode: React.FC = () => {
    const { t } = useTranslation('checker');
    // TODO: Dummy counts (replace with API data in future)
    const [useCases] = useState(dummyUseCases);
    const [useCaseCount] = useState(20); 
    const [violationCount] = useState(6); 
    const [search, setSearch] = useState('');

    // Filter use cases and interactions by search
    const filteredUseCases = useCases
        .map((uc) => ({
            ...uc,
            interactions: uc.interactions.filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase())
            ),
        }))
        .filter(
            (uc) =>
                uc.name.toLowerCase().includes(search.toLowerCase()) ||
                uc.interactions.length > 0 ||
                search === ''
        );

    return (
        <div
            style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '40px 16px',
                width: '100%',
                boxSizing: 'border-box',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <HomeIcon style={{ width: 32, height: 32, verticalAlign: 'middle', color: '#222' }} />
                </Link>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Info">
                    <InfoIcon style={{ width: 28, height: 28, verticalAlign: 'middle', color: '#222' }} />
                </button>
            </div>
            <h1 style={{ textAlign: 'center', fontSize: 40, margin: '16px 0 24px' }}>{t('title')}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', marginBottom: 8 }}>
                <CheckCircleIcon style={{ width: 28, height: 28, fill: '#4caf50', verticalAlign: 'middle' }} />
                <span style={{ fontWeight: 600, fontSize: 26, color: '#555' }}>{t('useCasesDetected', { count: useCaseCount })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
                <ErrorIcon style={{ width: 28, height: 28, fill: '#e65100', verticalAlign: 'middle' }} />
                <span style={{ fontWeight: 700, fontSize: 26, color: '#e65100' }}>{t('violationsPresent', { count: violationCount })}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    variant="outlined"
                    sx={{ mb: 3, borderRadius: 3, width: '100%', maxWidth: 600 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        style: { borderRadius: 24 }
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {filteredUseCases.map((useCase) => (
                    <Accordion
                        key={useCase.name}
                        sx={{ mb: 2, borderRadius: 2, width: '100%', maxWidth: 600 }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${useCase.name}-content`}
                            id={`${useCase.name}-header`}
                        >
                            <span style={{ fontWeight: 600, fontSize: 20 }}>{useCase.name}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            {useCase.interactions.length === 0 ? (
                                <span style={{ color: '#888', fontStyle: 'italic' }}>{t('noInteractions')}</span>
                            ) : (
                                <ul style={{ margin: 0, paddingLeft: 18 }}>
                                    {useCase.interactions.map((interaction) => (
                                        <li key={interaction.id} style={{ margin: '8px 0' }}>
                                            <Link
                                                to={`/use-case/${encodeURIComponent(useCase.name)}/interaction/${interaction.id}`}
                                                style={{ textDecoration: 'underline', color: '#1976d2', fontSize: 17 }}
                                            >
                                                {interaction.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

export default CheckerMode;