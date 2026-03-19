import type { GetLearningModeInputBoundary } from "../../use_case/getLearningMode/getLearningModeInputBoundary.js";

export class GetLearningModeController {
    constructor(
            private readonly inputBoundary: GetLearningModeInputBoundary
        ) {}
    
    getLearningMode(): void {
        this.inputBoundary.getLearningMode();
    }
}