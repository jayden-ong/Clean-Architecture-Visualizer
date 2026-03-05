import type { APIOutputBoundary } from "../../use_case/api/apiOutputBoundary.js";
import type { APIOutputData } from "../../use_case/api/apiOutputData.js";

export class APIPresesnter implements APIOutputBoundary {
    
    constructor(private readonly outputData: APIOutputData) {}
    getOutputData(): string {
        return JSON.stringify(this.outputData.getOuptutData(), null, 2);
    }
    
}