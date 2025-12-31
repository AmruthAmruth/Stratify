import { Router } from "express";
import { contactDI } from "../../di/ContactDI";
import { asyncHandler } from "../middleware/AsyncHandler";

const contactController = contactDI();
const contactRouter = Router();

contactRouter.post("/send", asyncHandler(contactController.sendMessage));

export default contactRouter;
