import express from "express";
import healthRouter from "./routes/healthRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { expertSlidesAIBackendStatus, expertSlidesBackendStatus, expertSlidesDatabaseStatus, expertSlidesFrontendStatus, expertSlidesLandingPageStatus } from "./utils/health/index.js";
import cronjob from "./schedulers/checkServiceStatusEveryHour.js";

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use('/api/health', healthRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get('/', async (_req, res) => {
    try {

        const [landingPage, frontend, backend, database, aiBackend] = await Promise.all([expertSlidesLandingPageStatus(), expertSlidesFrontendStatus(), expertSlidesBackendStatus(), expertSlidesDatabaseStatus(), expertSlidesAIBackendStatus()]);

        const summary = { landingPage, frontend, backend, database, aiBackend, };

        res.render("summary", { data: summary, });

    } catch (err) {
        console.error(err);
        res.render("summary", { data: {}, timestamp: new Date().toISOString() });
    }
});

app.listen(PORT, () => {
    console.log(`[PORT: ${PORT}]`);
    cronjob.start();
});