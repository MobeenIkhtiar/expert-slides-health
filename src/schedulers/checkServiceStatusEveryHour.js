import cron from "node-cron";
import { expertSlidesFrontendStatus, expertSlidesAIBackendStatus, expertSlidesBackendStatus, expertSlidesDatabaseStatus, expertSlidesLandingPageStatus } from "../utils/health/index.js";
import { sendEmailOnServiceDown } from "../utils/sendEmailOnServiceDown.js";

const cronjob = cron.schedule('0 * * * *', async () => {
    console.log('Running hourly service status check...');

    const [landingPage, frontend, backend, database, aiBackend,] = await Promise.all([expertSlidesLandingPageStatus(), expertSlidesFrontendStatus(), expertSlidesBackendStatus(), expertSlidesDatabaseStatus(), expertSlidesAIBackendStatus(),]);

    const summary = { landingPage, frontend, backend, database, aiBackend, };

    const services = [landingPage, frontend, backend, database, aiBackend,];
    const hasDownService = services.some(service => !service.ok || !service.reachable);

    if (hasDownService && process.env.ALERT_EMAIL_RECEIVER) {
        console.log('[ALERT] : SERVICE IS DOWN');
        console.log({ summary });
        await sendEmailOnServiceDown(process.env.ALERT_EMAIL_RECEIVER, summary);
    } else {
        console.log("All services are UP!", { summary });
    }
});

export default cronjob;