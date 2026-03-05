import type { APIInputBoundary } from "./apiInputBoundary.js";
import type { SessionDBAccessInterface } from "../../data_access/sessionDBAccessInterface.js";
import type { CleanArchInfoAccessInterface } from "../../data_access/cleanArchInfoAccessInterface.js";
import type { APIOutputData } from "./apiOutputData.js";

export class APIInteractor implements APIInputBoundary {

    constructor(
            private readonly db: SessionDBAccessInterface,
            private readonly cleanArchAccess: CleanArchInfoAccessInterface,
            private readonly outputData: APIOutputData
        ) {}

    async getLearningMode(): Promise<void> {
        let result: { [key: string]: any } = {}
        result.component_definitions = this.cleanArchAccess.getNodeInfo();
        result.layer_info = this.cleanArchAccess.getLayerInfo();
        this.outputData.setOutputData(result);
    }
}