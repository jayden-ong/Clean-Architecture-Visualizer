import type { CAEdge } from '../../lib/types';

export function Edge(edge: CAEdge) {
    const strokeColor = edge.status === 'VIOLATION' ? '#d32f2f' : 'black';
    const lineTitle = `${edge.source} -> ${edge.target} (${edge.type})`;

    return (
        <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            aria-label={lineTitle}
        >
            <title>{lineTitle}</title>
            <line
                x1={100}
                y1={120}
                x2={300}
                y2={200}
                stroke={strokeColor}
                strokeWidth={2}
            />
        </svg>
    )
}