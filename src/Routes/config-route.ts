import { Router } from "express";
import { allowRoles, authMiddleware } from "../Middleware/auth-middleware.js";
import {
    disableServer,
    enableServer,
    getServerStatus,
} from "../Controllers/config-controller.js";

const configRoutes = Router();

// GET /server-status - ดูสถานะการทำงานของเซิร์ฟเวอร์
configRoutes.get("/server-status", getServerStatus);

// POST /super/server/enable - เปิดเซิร์ฟเวอร์
configRoutes.post("/superadmin/server/enable",
    authMiddleware,
    allowRoles("SUPERADMIN"),
    enableServer);

// POST /super/server/disable - ปิดเซิร์ฟเวอร์
configRoutes.post("/superadmin/server/disable",
    authMiddleware,
    allowRoles("SUPERADMIN"),
    disableServer);

export default configRoutes;