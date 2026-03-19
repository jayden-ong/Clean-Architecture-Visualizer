import type { GetUseCaseInfoInputBoundary } from "../../use_case/getUseCaseInfo/getUseCaseInfoInputBoundary.js";

export class GetUseCaseInfoController {
    constructor(
            private readonly inputBoundary: GetUseCaseInfoInputBoundary
        ) {}
    
    getLearningMode(): void {
        this.inputBoundary.execute();
    }
}