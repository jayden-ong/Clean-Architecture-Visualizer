import type { GetFileContentInputBoundary } from "./getFileContentInputBoundary.js";
import type { SessionDBAccessInterface } from "../../data_access/sessionDBAccessInterface.js";
import type { FileAccessInterface } from "../../data_access/fileAccessInterface.js";
import type { GetFileContentInputData } from "./getFileContentInputData.js";
import type { GetFileContentOutputData } from "./getFileContentOutputData.js";

export class GetFileContentInteractor implements GetFileContentInputBoundary {

    constructor(
            private readonly db: SessionDBAccessInterface,
            private readonly fileAccess: FileAccessInterface,
            private readonly inputData: GetFileContentInputData,
            private readonly outputData: GetFileContentOutputData
        ) {}

    async getFileContent(): Promise<void> {
        const fileNameIndex = this.inputData.getFilePath().lastIndexOf("/");
        const fileName = this.inputData.getFilePath().substring(fileNameIndex + 1);
        const filePath = this.db.getFileByPath(fileName);
        if (!filePath) return;
        const fileContent = await this.fileAccess.getFileContent(filePath.filePath);
        const result = {
            file_path: this.inputData.getFilePath(),
            content: fileContent,
            language: filePath.fileType ?? "not_java",
            layer: filePath.layer,
            Violation_words: [],
            lines_with_violations: []
        }
        this.outputData.setOutputData(result);
        return;
    }

    
}