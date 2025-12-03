import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { GetManagerProfileUseCase } from "../application/use-cases/managers/GetManagerProfileUseCase";
import { UpdateManagerProfileUseCase } from "../application/use-cases/managers/UpdateManagerProfileUseCase";
import { ChangeManagerPasswordUseCase } from "../application/use-cases/managers/ChangeManagerPasswordUseCase";
import { ManagerController } from "../interfaces/controllers/ManagerController";

export const managerDI = () => {
    const managerRepo = new ManagerRepository();
    const projectRepo = new ProjectRepository();

    const getManagerProfileUseCase = new GetManagerProfileUseCase(
        managerRepo,
        projectRepo
    );

    const updateManagerProfileUseCase = new UpdateManagerProfileUseCase(
        managerRepo
    );

    const changeManagerPasswordUseCase = new ChangeManagerPasswordUseCase(
        managerRepo
    );

    return new ManagerController(
        getManagerProfileUseCase,
        updateManagerProfileUseCase,
        changeManagerPasswordUseCase
    );
};
