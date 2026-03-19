import type { GetViolationsInputBoundary } from "../../use_case/getViolations/GetViolationsInputBoundary.js";

export class GetViolationsController {
    constructor(
            private readonly inputBoundary: GetViolationsInputBoundary
        ) {}
    
    getLearningMode(): void {
        this.inputBoundary.execute();
    }
}