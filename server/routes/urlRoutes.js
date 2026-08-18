import express from "express";

import {
    createUrl,
    getUserUrls,
    getUrl,
    deleteUrl
} from "../controllers/urlController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createUrl);

router.get("/", protect, getUserUrls);

router.get("/:id", protect, getUrl);

router.delete("/:id", protect, deleteUrl);

export default router;