import type { CreateUseCaseInputData } from "./createUseCaseInputData.js";

export interface CreateUseCaseInputBoundary {
    execute(): Promise<void>;
    newUseCase(inputData: CreateUseCaseInputData): void;
}