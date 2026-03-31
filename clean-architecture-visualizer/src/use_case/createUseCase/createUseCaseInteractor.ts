import type { FileAccessInterface } from "../../data_access/fileAccessInterface.js";
import type { CreateUseCaseInputBoundary } from "./createUseCaseInputBoundary.js";
import type { CreateUseCaseInputData } from "./createUseCaseInputData.js";
import type { CreateUseCaseOutputData } from "./createUseCaseOutputData.js";
import path from "path";

export class CreateUseCaseinteractor implements CreateUseCaseInputBoundary {
    
    constructor(
        private readonly fileAccess: FileAccessInterface,
        private readonly inputData: CreateUseCaseInputData,
        private readonly outputData: CreateUseCaseOutputData
    ) {}

    async execute(): Promise<void> {
        try {
            const useCaseName = this.inputData.getUseCaseName().split(" ").join('');
            const currPath = await this.fileAccess.getCurrentPath();

            // Find base directories
            let useCaseDir = await this.fileAccess.bfsFindDir(currPath, "use_case");
            let interfaceAdapterDir = await this.fileAccess.bfsFindDir(currPath, "interface_adapter");

            if (!useCaseDir || !interfaceAdapterDir) {
                throw new Error("Could not find use_case or interface_adapter, try initiating project first");
            }

            const targetUseCasePath = path.join(useCaseDir, useCaseName);
            const targetInterfacePath = path.join(interfaceAdapterDir, useCaseName);

            await this.fileAccess.createDirectory(targetUseCasePath);
            await this.fileAccess.createDirectory(targetInterfacePath);

            const createJavaFile = async (dir: string, suffix: string) => {
                const fileName = `${useCaseName}${suffix}.java`;
                const fullPath = path.join(dir, fileName);
                return await this.fileAccess.createFile(fullPath);
            };

            // Use Case Layer Files
            await createJavaFile(targetUseCasePath, "InputBoundary");
            await createJavaFile(targetUseCasePath, "InputData");
            await createJavaFile(targetUseCasePath, "Interactor");
            await createJavaFile(targetUseCasePath, "OutputData");
            await createJavaFile(targetUseCasePath, "OutputBoundary");

            // Interface Adapter Layer Files
            await createJavaFile(targetInterfacePath, "Controller");
            await createJavaFile(targetInterfacePath, "Presenter");

            this.outputData.setOutputData(true);

        } catch (error) {
            console.error(error);
            this.outputData.setOutputData(false);
        }
    }
}