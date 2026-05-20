import { describe, it, expect, afterEach } from '@jest/globals';
import { GraphVerificationInteractor } from "../../../src/use_case/graphVerification/graphVerificationInteractor.js";
import { FileAccess } from "../../../src/data_access/fileAccess.js";
import { CleanArchAccess } from "../../../src/data_access/cleanArchInfoAccess.js";
import { SessionDBAccess } from "../../../src/data_access/sessionDBAccess.js";

import { useCaseGraph } from "../../../src/entity/useCaseGraph.js";

const genericFileAccess = new FileAccess();
const genericNeighbourAccess = new CleanArchAccess();
const genericDBAccess = new SessionDBAccess();

function makeUseCaseGraphs(types: string[]): useCaseGraph[] {
    let useCaseGraphs: useCaseGraph[] = [];
    types.forEach(type => {
        switch (type) {
            case "empty":
                useCaseGraphs.push(new useCaseGraph("empty"));
                break;
            case "good":
                const goodUseCase = new useCaseGraph("good");
                goodUseCase.setNodeNeighbour("useCaseInteractor", "entities");
                goodUseCase.setNodeNeighbour("dataAccess", "database");
                goodUseCase.setNodeNeighbour("view", "viewModel");
                goodUseCase.setNodeNeighbour("view", "controller");
                useCaseGraphs.push(goodUseCase);
                break;
            case "single":
                const singleViolation = new useCaseGraph("single");
                singleViolation.setNodeNeighbour("view", "viewModel");
                singleViolation.setNodeNeighbour("view", "entities");
                useCaseGraphs.push(singleViolation);
                break;
            case "multiple":
                const multipleViolations = new useCaseGraph("multiple");
                multipleViolations.setNodeNeighbour("entities", "view");
                multipleViolations.setNodeNeighbour("controller", "entities");
                useCaseGraphs.push(multipleViolations);
                break;
        }
    });
    return useCaseGraphs;
}

describe("Ensures that resolveLayer correctly identifies layers from their file path", () => {

    const genericInteractor = new GraphVerificationInteractor(
        genericFileAccess,
        genericNeighbourAccess,
        genericDBAccess
    );

    const testCases: [string, string][] = [
        ["frameworksAndDrivers",    "/src/views/test/testView.ts"],
        ["interfaceAdapters",       "/src/views/test/testViewModel.ts"],
        ["frameworksAndDrivers",    "/src/database/test/testDatabase.ts"],
        ["enterpriseBusinessRules", "/src/entity/test/testEntities.ts"],
        ["applicationBusinessRules","/src/data_access/test/testAccessInterface.ts"],
        ["frameworksAndDrivers",    "/src/data_access/test/testAccess.ts"],
        ["interfaceAdapters",       "/src/interface_adapters/test/testController.ts"],
        ["interfaceAdapters",       "/src/interface_adapters/test/testPresenter.ts"],
        ["applicationBusinessRules","/src/use_case/test/testInputBoundary.ts"],
        ["applicationBusinessRules","/src/use_case/test/testInputData.ts"],
        ["applicationBusinessRules","/src/use_case/test/testOutputBoundary.ts"],
        ["applicationBusinessRules","/src/use_case/test/testOutputData.ts"],
        ["applicationBusinessRules","/src/use_case/test/testInteractor.ts"],
    ];

    it.each(testCases)(
        "resolves '%s' from path '%s'", (expectedLayer, path) => {
            const result = (genericInteractor as any).resolveLayer(path);
            expect(result).toBe(expectedLayer);
        }
    );

    it.each(["/src/types/testTypes.ts", "/src/.gitkeep"])(
        "returns undefined from the path %s", (path) => {
            const result = (genericInteractor as any).resolveLayer(path);
            expect(result).toBeUndefined();
        }
    );
});

describe("Ensures that resolveLayer correctly identifies layers from their file path, snake_case", () => {

    const genericInteractor = new GraphVerificationInteractor(
        genericFileAccess,
        genericNeighbourAccess,
        genericDBAccess
    );

    const testCases: [string, string][] = [
        ["frameworksAndDrivers",    "/src/views/test/test_view.ts"],
        ["interfaceAdapters",       "/src/views/test/test_view_model.ts"],
        ["frameworksAndDrivers",    "/src/database/test/test_database.ts"],
        ["enterpriseBusinessRules", "/src/entity/test/test_entities.ts"],
        ["applicationBusinessRules","/src/data_access/test/test_access_interface.ts"],
        ["frameworksAndDrivers",    "/src/data_access/test/test_access.ts"],
        ["interfaceAdapters",       "/src/interface_adapters/test/test_controller.ts"],
        ["interfaceAdapters",       "/src/interface_adapters/test/test_presenter.ts"],
        ["applicationBusinessRules","/src/use_case/test/test_input_boundary.ts"],
        ["applicationBusinessRules","/src/use_case/test/test_input_data.ts"],
        ["applicationBusinessRules","/src/use_case/test/test_output_boundary.ts"],
        ["applicationBusinessRules","/src/use_case/test/test_output_data.ts"],
        ["applicationBusinessRules","/src/use_case/test/test_interactor.ts"],
    ];

    it.each(testCases)(
        "resolves '%s' from path '%s'", (expectedLayer, path) => {
            const result = (genericInteractor as any).resolveLayer(path);
            expect(result).toBe(expectedLayer);
        }
    );

    it.each(["/src/types/testTypes.ts", "/src/.gitkeep"])(
        "returns undefined from the path %s", (path) => {
            const result = (genericInteractor as any).resolveLayer(path);
            expect(result).toBeUndefined();
        }
    );
});

describe("Ensures that verifyOutNeighbours correctly classifies the number of Clean violations", () => {

    function getAllViolations(graphs: useCaseGraph[]): number {
        let result = 0;
        graphs.forEach(element => {
            result += element.getViolationCount();
        });
        return result;
    }

    const testCases = [
        ["Empty usecase has 0 violations",                              makeUseCaseGraphs(["empty"]),                                   0],
        ["Use case with no violations reports 0 violations",            makeUseCaseGraphs(["good"]),                                    0],
        ["Use case with 1 violation reports 1 violation",               makeUseCaseGraphs(["single"]),                                  1],
        ["Use case with 2 violations reports 2 violations",             makeUseCaseGraphs(["multiple"]),                                2],
        ["Multiple usecases with violations are properly reported",     makeUseCaseGraphs(["single", "multiple"]),                      3],
        ["Only use cases with violations report violations",            makeUseCaseGraphs(["empty", "good", "single", "multiple"]),     3],
    ];

    it.each(testCases)(
        "%s", async (_, useCaseGraphList, expectedViolations) => {
            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                genericDBAccess,
                (useCaseGraphList as useCaseGraph[])
            );
            await (interactor as any).verifyOutNeighbours();
            const violationCount = getAllViolations((interactor as any).useCaseGraphList);
            expect(violationCount).toBe(expectedViolations);
        }
    );
});

describe("Ensures that populateDatabase correctly populates the database", () => {

    describe("use case and violation counts", () => {

        const testCases: [string, useCaseGraph[], number, number][] = [
            ["Empty use case list sets 0 use cases and 0 violations",               [],                                             0, 0],
            ["Single use case with no violations",                                  makeUseCaseGraphs(["empty"]),                   1, 0],
            ["Single use case with 1 violation",                                    makeUseCaseGraphs(["single"]),                  1, 1],
            ["Multiple use cases with violations are summed correctly",             makeUseCaseGraphs(["single", "multiple"]),      2, 3],
        ];

        it.each(testCases)(
            "%s", async (_, useCaseGraphList, expectedUseCases, expectedViolations) => {
                const dbAccess = new SessionDBAccess();
                const interactor = new GraphVerificationInteractor(
                    genericFileAccess,
                    genericNeighbourAccess,
                    dbAccess,
                    useCaseGraphList
                );
                await (interactor as any).verifyOutNeighbours();
                await (interactor as any).populateDatabase();

                expect(dbAccess.getNumUseCases()).toBe(expectedUseCases);
                expect(dbAccess.getNumViolations()).toBe(expectedViolations);
            }
        );
    });

    describe("use cases are stored correctly", () => {

        it("stores all use cases with correct ids and names", async () => {
            const dbAccess = new SessionDBAccess();
            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                makeUseCaseGraphs(["empty", "single"])
            );
            await (interactor as any).populateDatabase();

            const uc0 = dbAccess.getUseCaseById("uc-0");
            const uc1 = dbAccess.getUseCaseById("uc-1");

            expect(uc0?.name).toBe("empty");
            expect(uc1?.name).toBe("single");
        });

        it("stores violation edges on the correct use case", async () => {
            const dbAccess = new SessionDBAccess();
            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                makeUseCaseGraphs(["single"])
            );
            await (interactor as any).verifyOutNeighbours();
            await (interactor as any).populateDatabase();

            const uc = dbAccess.getUseCaseById("uc-0");
            expect(uc?.violationEdges).toContainEqual(["view", "entities"]);
        });
    });

    describe("edges are stored correctly", () => {

        it("stores VALID edges from use case neighbour maps", async () => {
            const dbAccess = new SessionDBAccess();
            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                makeUseCaseGraphs(["empty"])
            );
            await (interactor as any).verifyOutNeighbours();
            await (interactor as any).populateDatabase();

            // emptyUseCase has no neighbours so edges should be empty
            expect(dbAccess.getAllEdges()).toHaveLength(0);
        });

        it("marks violation edges as INCORRECT_DEPENDENCY", async () => {
            const dbAccess = new SessionDBAccess();
            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                makeUseCaseGraphs(["single"])
            );
            await (interactor as any).verifyOutNeighbours();
            await (interactor as any).populateDatabase();

            const violationEdge = dbAccess.getEdgeById("view->entities");
            expect(violationEdge?.status).toBe("INCORRECT_DEPENDENCY");
        });

        it("marks non-violation edges as VALID", async () => {
            const dbAccess = new SessionDBAccess();
            const uc = new useCaseGraph("valid");
            uc.setNodeNeighbour("view", "viewModel");

            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                [uc]
            );
            await (interactor as any).verifyOutNeighbours();
            await (interactor as any).populateDatabase();

            const validEdge = dbAccess.getEdgeById("view->viewModel");
            expect(validEdge?.status).toBe("VALID");
        });

        it("deduplicates edges across use cases", async () => {
            const dbAccess = new SessionDBAccess();
            const uc1 = new useCaseGraph("uc1");
            const uc2 = new useCaseGraph("uc2");
            uc1.setNodeNeighbour("view", "viewModel");
            uc2.setNodeNeighbour("view", "viewModel");

            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                [uc1, uc2]
            );
            await (interactor as any).populateDatabase();

            const edges = dbAccess.getEdgesBySource("view").filter(e => e.target === "viewModel");
            expect(edges).toHaveLength(1);
        });
    });

    describe("nodes are stored correctly", () => {

        it("marks nodes involved in violations as VIOLATION", async () => {
            const dbAccess = new SessionDBAccess();
            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                makeUseCaseGraphs(["single"])
            );
            await (interactor as any).verifyOutNeighbours();
            await (interactor as any).populateDatabase();

            const violationNodes = dbAccess.getNodesByStatus("VIOLATION");
            const nodeTypes = violationNodes.map(n => n.type);
            expect(nodeTypes).toContain("view");
            expect(nodeTypes).toContain("entities");
        });

        it("marks missing nodes as MISSING", async () => {
            const dbAccess = new SessionDBAccess();
            const uc = new useCaseGraph("sparse");
            uc.setNodeNeighbour("view", "viewModel"); // only two nodes present

            const interactor = new GraphVerificationInteractor(
                genericFileAccess,
                genericNeighbourAccess,
                dbAccess,
                [uc]
            );
            await (interactor as any).populateDatabase();

            const missingNodes = dbAccess.getNodesByStatus("MISSING");
            expect(missingNodes.length).toBeGreaterThan(0);
        });
    });
});