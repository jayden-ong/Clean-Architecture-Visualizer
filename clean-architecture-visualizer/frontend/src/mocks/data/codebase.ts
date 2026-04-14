import { FileRelation, FileContent } from "../../lib";

export const mockFileTree = {
  id: "src",
  name: "src",
  type: "directory",
  path: "src/",
  children: [
    {
      id: "src/interface_adapters",
      name: "interface_adapters",
      type: "directory",
      path: "src/interface_adapters/",
      layer: "InterfaceAdapters",
      children: [
        {
          id: "src/interface_adapters/UserSignOutController.java",
          name: "UserSignOutController.java",
          type: "file",
          path: "src/interface_adapters/UserSignOutController.java",
          hasViolation: false,
        },
      ],
    },
    {
      id: "src/use_cases",
      name: "use_cases",
      type: "directory",
      path: "src/use_cases/",
      layer: "ApplicationBusinessRules",
      children: [
        {
          id: "src/use_cases/UserSignOutInteractor.java",
          name: "UserSignOutInteractor.java",
          type: "file",
          path: "src/use_cases/UserSignOutInteractor.java",
          hasViolation: true,
        },
      ],
    },
    {
      id: "src/views",
      name: "views",
      type: "directory",
      path: "src/views/",
      layer: "Frameworks",
      children: [
        {
          id: "src/views/UserSignOutView.java",
          name: "UserSignOutView.java",
          type: "file",
          path: "src/views/UserSignOutView.java",
          hasViolation: false,
        },
      ],
    },
    {
      id: "src/framework_drivers",
      name: "framework_drivers",
      type: "directory",
      path: "src/framework_drivers/",
      layer: "Frameworks",
      children: [
        {
          id: "src/framework_drivers/UserSignOutDataAccess.java",
          name: "UserSignOutDataAccess.java",
          type: "file",
          path: "src/framework_drivers/UserSignOutDataAccess.java",
          hasViolation: false,
        },
        {
          id: "src/framework_drivers/Database.java",
          name: "Database.java",
          type: "file",
          path: "src/framework_drivers/Database.java",
          hasViolation: false,
        },
      ],
    },
  ],
};

export const mockFiles: Record<string, FileContent> = {
  "src/interface_adapters/UserSignOutController.java": {
    file_path: "src/interface_adapters/UserSignOutController.java",
    content: `package interface_adapters;

import use_cases.UserSignOutInteractor;

public class UserSignOutController {
    private final UserSignOutInteractor interactor;

    public UserSignOutController(UserSignOutInteractor interactor) {
        this.interactor = interactor;
    }

    public void execute() {
        interactor.execute();
    }
}`,
    language: "java",
    layer: "InterfaceAdapters",
    lines_with_violations: [],
  },
  "src/use_cases/UserSignOutInteractor.java": {
    file_path: "src/use_cases/UserSignOutInteractor.java",
    content: `package use_cases;

import framework_drivers.Database;

public class UserSignOutInteractor {
    private final Database database;

    public UserSignOutInteractor(Database database) {
        this.database = database;
    }

    public void execute() {
        database.clearSession();
    }
}`,
    language: "java",
    layer: "ApplicationBusinessRules",
    lines_with_violations: [3],
  },
  "src/views/UserSignOutView.java": {
    file_path: "src/views/UserSignOutView.java",
    content: `package views;

import javax.swing.JPanel;

public class UserSignOutView extends JPanel {
}`,
    language: "java",
    layer: "Frameworks",
    lines_with_violations: [],
  },
  "src/framework_drivers/UserSignOutDataAccess.java": {
    file_path: "src/framework_drivers/UserSignOutDataAccess.java",
    content: `package framework_drivers;

public class UserSignOutDataAccess {
    public void clear() {
    }
}`,
    language: "java",
    layer: "Frameworks",
    lines_with_violations: [],
  },
  "src/framework_drivers/Database.java": {
    file_path: "src/framework_drivers/Database.java",
    content: `package framework_drivers;

public class Database {
    public void clearSession() {
    }
}`,
    language: "java",
    layer: "Frameworks",
    lines_with_violations: [],
  },
};

export const mockFileRelationsByPath: Record<string, FileRelation[]> = {
  "src/use_cases/UserSignOutInteractor.java": [
    {
      type: "DEPENDENCY",
      target_file: "src/framework_drivers/Database.java",
      line: 3,
      description: "Interactor depends on database driver.",
      layer: "Frameworks",
    },
  ],
};