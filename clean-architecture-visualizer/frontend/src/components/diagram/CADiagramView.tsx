import { CANodeView, Edge } from './index';
import {CANode, CAEdge} from './../../lib/types';

export function CADiagramView(nodes: CANode[], edges: CAEdge[]) {
    return (
        <>
            {nodes.map((node: CANode) => (
                <CANodeView {...node} />
            ))}
            {edges.map((edge: CAEdge) => (
                <Edge {...edge} />
            ))}
        </>
    )
}