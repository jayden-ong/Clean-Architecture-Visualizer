import type { FileAccess } from "../data_access/fileAccess.js";
import type { CleanArchAccess } from "../data_access/cleanArchInfoAccess.js";
import type { SessionDBAccess } from "../data_access/sessionDBAccess.js";

import type { GraphVerificationController } from "../interface_adapter/graphVerification/graphVerificationController.js";
import type { GraphVerificationInputBoundary } from "../use_case/graphVerification/graphVerificationInputBoundary.js";
import type { InitProjectInputBoundary } from "../use_case/initProject/initProjectInputBoundary.js";
import type { InitProjectContoller } from "../interface_adapter/intiProject/initProjectContoller.js";
import type { CreateUseCaseInputBoundary } from "../use_case/createUseCase/createUseCaseInputBoundary.js";
import type { CreateUseCaseController } from "../interface_adapter/createUseCase/createUseCaseController.js";
import { CreateUseCaseInputData } from "../use_case/createUseCase/createUseCaseInputData.js";


export class AppBuilder {
    private fileAccess?: FileAccess;
    private cleanArchAccess?: CleanArchAccess;
    private db?: SessionDBAccess;
    private graphVerificationInteractor?: GraphVerificationInputBoundary;
    private graphVerificationController?: GraphVerificationController;
    private initProjectInteractor?: InitProjectInputBoundary;
    private initProjectController?: InitProjectContoller;
    private createUseCaseInteractor?: CreateUseCaseInputBoundary;
    private createUseCaseController?: CreateUseCaseController; 

    // Data Access Layer
    withFileAccess(fileAccess: FileAccess): this {
        this.fileAccess = fileAccess;
        return this;
    }

    withCleanArchAccess(access: CleanArchAccess): this {
        this.cleanArchAccess = access;
        return this;
    }

    withSessionDBAccess(db: SessionDBAccess): this {
        this.db = db;
        return this;
    }

    // Use Case Layer
    buildGraphVerificationInteractor(
        InteractorClass: new (
            fileAccess: FileAccess,
            cleanArchAccess: CleanArchAccess,
            db: SessionDBAccess
        ) => GraphVerificationInputBoundary
        ): this {
        if (!this.fileAccess || !this.cleanArchAccess || !this.db) {
            throw new Error("FileAccess, CleanArchAccess, and SessionDBAccess must be set before building interactor");
        }

        this.graphVerificationInteractor = new InteractorClass(
            this.fileAccess,
            this.cleanArchAccess,
            this.db
            );
        return this;
    }

    buildInitProjectInteractor(
        InteractorClass: new (
            fileAccess: FileAccess
        ) => InitProjectInputBoundary
        ): this {
        if (!this.fileAccess) {
            throw new Error("FileAccess must be set before building interactor")
        }
        this.initProjectInteractor = new InteractorClass(
            this.fileAccess
        );
        return this;
    }

    buildCreateUseCaseInteractor(
        InteractorClass: new (
            fileAccess: FileAccess
        ) => CreateUseCaseInputBoundary
        ): this {
        if (!this.fileAccess) {
            throw new Error("FileAccess must be set before building interactor")
        }
        this.createUseCaseInteractor = new InteractorClass(
            this.fileAccess
        );
        return this;
    }

    // Controller Layer
    buildGraphVerificationController(
        ControllerClass: new (interactor: GraphVerificationInputBoundary) => GraphVerificationController
        ): this {
        if (!this.graphVerificationInteractor) {
            throw new Error("GraphVerificationInteractor must be built before controller");
        }
        
        this.graphVerificationController = new ControllerClass(
            this.graphVerificationInteractor
            );
        return this;
    }

    buildInitProjectController(
        ControllerClass: new (interactor: InitProjectInputBoundary) => InitProjectContoller
        ): this {
        if (!this.initProjectInteractor) {
            throw new Error("InitProjectInteractor must be built before controller");
        }
        
        this.initProjectController = new ControllerClass(
            this.initProjectInteractor
            );
        return this;
    }

    buildCreateUseCaseController(
        ControllerClass: new (interactor: CreateUseCaseInputBoundary) => CreateUseCaseController
        ): this {
        if (!this.createUseCaseInteractor) {
            throw new Error("CreateUseCaseInteractor must be built before controller");
        }
        
        this.createUseCaseController = new ControllerClass(
            this.createUseCaseInteractor
            );
        return this;
    }

    build() {
        return {
            fileAccess: this.fileAccess!,
            validOutNeighbourAccess: this.cleanArchAccess!,
            graphVerificationInteractor: this.graphVerificationInteractor!,
            initProjectInteractor: this.initProjectInteractor!,
            createUseCaseInteractor: this.createUseCaseInteractor!,
            createUseCaseController: this.createUseCaseController!,
            graphVerificationController: this.graphVerificationController!,
            initProjectController: this.initProjectController!,

        };
    }

    runGraphVerification() {
        this.graphVerificationController?.execute();
    }

    runInitProject() {
        this.initProjectController?.execute();
    }

    runCreateUseCase(name: string) {
        const inputData = new CreateUseCaseInputData(name);
        this.createUseCaseInteractor?.newUseCase(inputData);
        this.createUseCaseController?.execute();
    }
}