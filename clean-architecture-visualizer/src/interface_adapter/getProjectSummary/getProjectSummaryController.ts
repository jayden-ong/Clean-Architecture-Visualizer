import type { GetProjectSummaryInputBoundary } from "../../use_case/getProjectSummary/getProjectSummaryInputBoundary.js";

export class GetProjectSummaryController {
    constructor(
            private readonly inputBoundary: GetProjectSummaryInputBoundary
        ) {}
    
    getLearningMode(): void {
        this.inputBoundary.getProjectSummary();
    }
}