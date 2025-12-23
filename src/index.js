import express from "express";
import healthRouter from "./routes/healthRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { expertSlidesAIBackendStatus, expertSlidesBackendStatus, expertSlidesDatabaseStatus, expertSlidesFrontendStatus, expertSlidesLandingPageStatus, expertSlidesLLMStatus } from "./utils/health/index.js";
import cronjob from "./schedulers/checkServiceStatusEveryHour.js";
// import { sendEmailOnServiceDown } from "./utils/sendEmailOnServiceDown.js";

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

        const [landingPage, frontend, backend, database, aiBackend, claude, perplexity] = await Promise.all([expertSlidesLandingPageStatus(), expertSlidesFrontendStatus(), expertSlidesBackendStatus(), expertSlidesDatabaseStatus(), expertSlidesAIBackendStatus(), expertSlidesLLMStatus('claude'), expertSlidesLLMStatus('perplexity')]);

        const summary = { landingPage, frontend, backend, database, aiBackend, claude, perplexity };

        res.render("summary", { data: summary, });

        // setImmediate(() => {
        //     const services = [landingPage, frontend, backend, database, aiBackend, claude, perplexity];
        //     const hasDownService = services.some(service => !service.ok || !service.reachable);

        //     if (hasDownService && process.env.ALERT_EMAIL_RECEIVER) {
        //         console.log('[ALERT] : SERVICE IS DOWN');
        //         sendEmailOnServiceDown(process.env.ALERT_EMAIL_RECEIVER, summary)
        //             .catch(e => console.log(e.message));
        //     } else {
        //         console.log("All services are UP!", { summary });
        //     }
        // });

    } catch (err) {
        console.error(err);
        res.render("summary", { data: {}, timestamp: new Date().toISOString() });
    }
});

app.listen(PORT, () => {
    console.log(`[PORT: ${PORT}]`);
    cronjob.start();
});