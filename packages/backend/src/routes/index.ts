import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import sitesRoutes from "./sites.routes";
import activitiesRoutes from "./activities.routes";
import equipmentRoutes from "./equipment.routes";
import materialsRoutes from "./materials.routes";
import transfersRoutes from "./transfers.routes";
import syncRoutes from "./sync.routes";
import reportsRoutes from "./reports.routes";
import notificationsRoutes from "./notifications.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/sites", sitesRoutes);
router.use("/activities", activitiesRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/materials", materialsRoutes);
router.use("/transfers", transfersRoutes);
router.use("/sync", syncRoutes);
router.use("/reports", reportsRoutes);
router.use("/notifications", notificationsRoutes);

export default router;
