import { useQuery } from '@tanstack/react-query';
import { getAnalysisSummary, getInteractionDetails, getViolations } from '../api/analysis.api.ts';
import { getUseCaseDiagramData, type UseCaseDiagramData } from '../api/getUseCaseDiagramData';
import { AnalysisSummary, InteractionDetail, Violation } from '../lib/types.ts';

export const useAnalysisSummary = () => {
  return useQuery<AnalysisSummary, Error>({
    queryKey: ['analysis-summary'],
    queryFn: getAnalysisSummary,
  });
};

export const useInteraction = (interactionId: string) => {
  return useQuery<InteractionDetail, Error>({
    queryKey: ['interaction', interactionId],
    queryFn: () => getInteractionDetails(interactionId),
    enabled: !!interactionId,
  });
};

export const useInteractionViolations = (interactionId: string) => {
  return useQuery<Violation[], Error>({
    queryKey: ['violations', interactionId],
    queryFn: () => getViolations(interactionId),
    enabled: !!interactionId,
  });
};

export const useUseCaseDiagramData = (useCaseName: string, interactionName?: string) => {
  return useQuery<UseCaseDiagramData, Error>({
    queryKey: ['use-case-diagram', useCaseName, interactionName],
    queryFn: () => getUseCaseDiagramData(useCaseName, interactionName),
    enabled: !!useCaseName,
  });
};