import type { APIInputBoundary } from "../../use_case/api/apiInputBoundary.js";

export class APIController {
    constructor(
            private readonly inputBoundary: APIInputBoundary
        ) {}
    
    getLearningMode(): void {
        this.inputBoundary.getLearningMode();
    }
}
