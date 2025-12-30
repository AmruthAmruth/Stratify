import { Router } from "express";
import { contactDI } from "../../di/ContactDI";
import { createContactRoutes } from "./contactRoutes";

const contactController = contactDI();
const router = createContactRoutes(contactController);

export default router;
