import type { GetFileTreeInputBoundary } from "../../use_case/getFileTree/getFileTreeInputBoundary.js";

export class GetFileTreeController {
    constructor(
            private readonly inputBoundary: GetFileTreeInputBoundary
        ) {}
    
    getLearningMode(): void {
        this.inputBoundary.getFileTree();
    }
}