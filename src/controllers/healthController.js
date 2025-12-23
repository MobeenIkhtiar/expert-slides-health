import { expertSlidesAIBackendStatus, expertSlidesBackendStatus, expertSlidesDatabaseStatus, expertSlidesFrontendStatus, expertSlidesLLMStatus, expertSlidesLandingPageStatus } from "../utils/health/index.js";
import { serverErrorResponse, successResponse } from "../utils/responses.js";
import { sendEmailOnServiceDown } from "../utils/sendEmailOnServiceDown.js";

export const expertSlidesHealthMonitor = async (_req, res) => {
    try {

        const [landingPage, frontend, backend, database, aiBackend, claude, perplexity] = await Promise.all([expertSlidesLandingPageStatus(), expertSlidesFrontendStatus(), expertSlidesBackendStatus(), expertSlidesDatabaseStatus(), expertSlidesAIBackendStatus(), expertSlidesLLMStatus('claude'), expertSlidesLLMStatus('perplexity')]);

        const summary = { landingPage, frontend, backend, database, aiBackend, claude, perplexity };

        // Check if any service is down
        const services = [landingPage, frontend, backend, database, aiBackend, claude, perplexity];
        const hasDownService = services.some(service => !service.ok || !service.reachable);

        // Send email if any service is down
        if (hasDownService && process.env.ALERT_EMAIL_RECEIVER) {
            await sendEmailOnServiceDown(process.env.ALERT_EMAIL_RECEIVER, summary);
        }

        return successResponse(res, "Health monitoring finished successfully!", summary);

    } catch (error) {

        console.error("Error in health monitor:", error);
        return serverErrorResponse(res, error.message);

    }
};