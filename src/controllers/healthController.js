import { expertSlidesAIBackendStatus, expertSlidesBackendStatus, expertSlidesDatabaseStatus, expertSlidesFrontendStatus, expertSlidesLandingPageStatus } from "../utils/health/index.js";
import { serverErrorResponse, successResponse } from "../utils/responses.js";
import { sendEmailOnServiceDown } from "../utils/sendEmailOnServiceDown.js";

export const expertSlidesHealthMonitor = async (_req, res) => {
    try {

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

        return successResponse(res, "Health monitoring finished successfully!", summary);

    } catch (error) {

        console.error("Error in health monitor:", error);
        return serverErrorResponse(res, error.message);

    }
};