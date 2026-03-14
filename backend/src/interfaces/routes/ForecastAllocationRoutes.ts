import { Router } from "express";
import { ForecastAllocationDI } from "../../di/ForecastAllocationDI";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";
import { validateRequest } from "../middleware/ValidationMiddleware";
import { CreateForecastAllocationSchema, UpdateForecastAllocationSchema } from "../../application/validators/OtherValidators";

const router = Router();
const controller = ForecastAllocationDI.getForecastAllocationController();

// Create forecast allocation (Company/Manager only)
router.post(
    "/",
    authMiddleware(["company", "manager"]),
    validateRequest(CreateForecastAllocationSchema),
    asyncHandler((req, res) => controller.create(req, res)),
);

// Update forecast allocation (Company/Manager only)
router.put(
    "/:id",
    authMiddleware(["company", "manager"]),
    validateRequest(UpdateForecastAllocationSchema),
    asyncHandler((req, res) => controller.update(req, res)),
);

// Get forecast allocations by project
router.get(
    "/project/:projectId",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.getByProject(req, res)),
);

// Get forecast allocations by employee
router.get(
    "/employee/:employeeId",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.getByEmployee(req, res)),
);

// Get forecast allocation by ID
router.get(
    "/:id",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.getById(req, res)),
);

// Calculate forecast vs actual
router.get(
    "/compare/:employeeId/:projectId",
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler((req, res) => controller.calculateVsActual(req, res)),
);

// Delete forecast allocation (Company/Manager only)
router.delete(
    "/:id",
    authMiddleware(["company", "manager"]),
    asyncHandler((req, res) => controller.delete(req, res)),
);

export default router;
