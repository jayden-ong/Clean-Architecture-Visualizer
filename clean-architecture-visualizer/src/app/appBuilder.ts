import chalk from "chalk";

import type { FileAccess } from "../data_access/fileAccess.js";
import type { CleanArchAccess } from "../data_access/cleanArchInfoAccess.js";
import type { SessionDBAccess } from "../data_access/sessionDBAccess.js";

import { GraphVerificationController } from "../interface_adapter/graphVerification/graphVerificationController.js";
import type { GraphVerificationInputBoundary } from "../use_case/graphVerification/graphVerificationInputBoundary.js";
import { GraphVerificationOutputData } from "../use_case/graphVerification/graphVerificationOutputData.js";
import { GraphVerificationPresenter } from "../interface_adapter/graphVerification/graphVerificationPresenter.js";
import type { useCaseGraph } from "../entity/useCaseGraph.js";
import type { InitProjectInputBoundary } from "../use_case/initProject/initProjectInputBoundary.js";
import type { InitProjectContoller } from "../interface_adapter/intiProject/initProjectContoller.js";
import type { CreateUseCaseInputBoundary } from "../use_case/createUseCase/createUseCaseInputBoundary.js";
import type { CreateUseCaseController } from "../interface_adapter/createUseCase/createUseCaseController.js";
import { InitProjectOutputData } from "../use_case/initProject/initProjectOutputData.js";
import { CreateUseCaseInteractor } from "../use_case/createUseCase/createUseCaseInteractor.js";
import { CreateUseCasePresenter } from "../interface_adapter/createUseCase/createUseCasePresenter.js";

import { stopServer } from "../server/server.js";
import type { GraphVerificationOutputBoundary } from "../use_case/graphVerification/graphVerificationOutputBoundary.js";

export class AppBuilder {
    private fileAccess?: FileAccess;
    private cleanArchAccess?: CleanArchAccess;
    private db?: SessionDBAccess;
    private graphVerificationInteractor?: GraphVerificationInputBoundary;
    private graphVerificationController?: GraphVerificationController;
    private graphVerificationOutputData?: GraphVerificationOutputData;
    private graphVerificationPresenter?: GraphVerificationOutputBoundary;
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
            db: SessionDBAccess,
            presenter: GraphVerificationOutputBoundary,
            useCaseGraphList: useCaseGraph[],
            outputData: GraphVerificationOutputData
        ) => GraphVerificationInputBoundary,
        ): this {
        if (!this.fileAccess || !this.cleanArchAccess || !this.db) {
            throw new Error("FileAccess, CleanArchAccess, and SessionDBAccess must be set before building interactor");
        }
        this.graphVerificationOutputData = new GraphVerificationOutputData();
        this.graphVerificationPresenter = new GraphVerificationPresenter();

        this.graphVerificationInteractor = new InteractorClass(
            this.fileAccess,
            this.cleanArchAccess,
            this.db,
            this.graphVerificationPresenter,
            [],
            this.graphVerificationOutputData
            );
        return this;
    }

    buildCreateUseCaseInteractor(): this {
        if (!this.fileAccess) {
            throw new Error("FileAccess must be set before building CreateUseCaseInteractor");
        }
        const createUseCasePresenter = new CreateUseCasePresenter();
        this.createUseCaseInteractor = new CreateUseCaseInteractor(this.fileAccess, createUseCasePresenter);
        return this;
    }

    buildInitProjectInteractor(
        InteractorClass: new (
            fileAccess: FileAccess,
            outputData?: InitProjectOutputData
        ) => InitProjectInputBoundary
    ): this {
        if (!this.fileAccess) {
            throw new Error("FileAccess must be set before building InitProjectInteractor");
        }
        this.initProjectInteractor = new InteractorClass(this.fileAccess);
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
        this.createUseCaseController = new ControllerClass(this.createUseCaseInteractor);
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
        const formatForCLI = false // run from app
        this.graphVerificationController?.execute(formatForCLI);
    }

    async runCLIGraphVerification() {
        const formatForCLI = true // run in terminal
        await this.graphVerificationController?.execute(formatForCLI);
    }

    runInitProject() {
        this.initProjectController?.execute();
        console.log(chalk.green("Your project has been initialized."));
    }

    runCreateUseCase(name: string) {
        this.createUseCaseController?.execute(name);
    }

    async runEndProject() {
        this.db?.resetDB();
        await stopServer();
    }
}