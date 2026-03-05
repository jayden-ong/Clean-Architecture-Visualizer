export class APIOutputData {

    private apiOutputData?: { [key: string]: any }

    setOutputData(outputData: { [key: string]: any }) {
        this.apiOutputData = outputData;
    }
    
    getOuptutData(): object {
        if (this.apiOutputData) return this.apiOutputData;
        return {};
    }
}