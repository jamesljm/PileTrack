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
import holdPointsRoutes from "./hold-points.routes";
import productionRoutes from "./production.routes";
import dailyLogRoutes from "./daily-log.routes";
import boreholeLogRoutes from "./borehole-log.routes";
import testResultRoutes from "./test-result.routes";

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
router.use("/", holdPointsRoutes);
router.use("/", productionRoutes);
router.use("/daily-logs", dailyLogRoutes);
router.use("/borehole-logs", boreholeLogRoutes);
router.use("/test-results", testResultRoutes);

export default router;
