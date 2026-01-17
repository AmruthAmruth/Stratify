import { Router } from "express";
import { ForecastAllocationDI } from "../../di/ForecastAllocationDI";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";

const router = Router();
const controller = ForecastAllocationDI.getForecastAllocationController();


router.post(
    "/",
    authMiddleware(["company", "manager"]),
    asyncHandler((req, res) => controller.create(req, res)),
);


router.put(
    "/:id",
    authMiddleware(["company", "manager"]),
    asyncHandler((req, res) => controller.update(req, res)),
);


router.get(
    "/project/:projectId",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.getByProject(req, res)),
);


router.get(
    "/employee/:employeeId",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.getByEmployee(req, res)),
);


router.get(
    "/:id",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.getById(req, res)),
);


router.get(
    "/compare/:employeeId/:projectId",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.calculateVsActual(req, res)),
);


router.delete(
    "/:id",
    authMiddleware(["company", "manager"]),
    asyncHandler((req, res) => controller.delete(req, res)),
);

export default router;
