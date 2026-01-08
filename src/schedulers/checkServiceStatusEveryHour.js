import cron from "node-cron";
import { expertSlidesFrontendStatus, expertSlidesAIBackendStatus, expertSlidesBackendStatus, expertSlidesDatabaseStatus, expertSlidesLandingPageStatus } from "../utils/health/index.js";
import { sendEmailOnServiceDown } from "../utils/sendEmailOnServiceDown.js";

const cronjob = cron.schedule('0 * * * *', async () => {
    console.log('Running hourly service status check...');

    const [landingPage, frontend, backend, database, aiBackend,] = await Promise.all([expertSlidesLandingPageStatus(), expertSlidesFrontendStatus(), expertSlidesBackendStatus(), expertSlidesDatabaseStatus(), expertSlidesAIBackendStatus(),]);

    const summary = { landingPage, frontend, backend, database, aiBackend, };

    const services = [landingPage, frontend, backend, database, aiBackend,];
    const hasDownService = services.some(service => !service.ok || !service.reachable);

    const ALERT_EMAIL_RECEIVERS = process.env.ALERT_EMAIL_RECEIVERS?.split(',').map((e) => e.trim()).filter(Boolean) || [];

    if (hasDownService && ALERT_EMAIL_RECEIVERS && ALERT_EMAIL_RECEIVERS.length > 0) {
        await Promise.allSettled(ALERT_EMAIL_RECEIVERS.map((email) => sendEmailOnServiceDown(email, summary)))
    } else {
        console.log('ALERT_EMAIL_RECEIVERS is missing or invalid. Please provide a comma separated string of emails.');
    }

    if (!hasDownService) {
        console.log('Everything is good!');
    }
    
});

export default cronjob;