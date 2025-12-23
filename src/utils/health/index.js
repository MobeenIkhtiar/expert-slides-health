import axios from "axios";
import isHealthyStatus from "./isHealthyStatus.js";

const expertSlidesBackendStatus = async () => {

    const url = `${process.env.BACKEND_SERVER_URL}/api/v1/health/backend-status`;
    const startTime = Date.now();
    const serviceName = process.env.BACKEND_SERVICE_NAME || "expert-slides-backend";

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const latencyMs = Date.now() - startTime;
        const reachable = isHealthyStatus(response.status);

        return {
            service: serviceName,
            url,
            ok: reachable,
            reachable,
            status: response.status,
            statusText: response.statusText ?? null,
            latencyMs,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        return {
            service: serviceName,
            url,
            ok: false,
            reachable: false,
            status: null,
            statusText: null,
            latencyMs,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
};

const expertSlidesFrontendStatus = async () => {

    const serviceName = process.env.FRONTEND_SERVICE_NAME || "expert-slides-frontend";
    const url = `${process.env.FRONTEND_URL}/login`;
    const startTime = Date.now();

    try {
        if (!process.env.FRONTEND_URL) {
            throw new Error("FRONTEND_URL is not configured in environment variables");
        }

        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const latencyMs = Date.now() - startTime;
        const reachable = isHealthyStatus(response.status);

        return {
            service: serviceName,
            url,
            ok: reachable,
            reachable,
            status: response.status,
            statusText: response.statusText ?? null,
            latencyMs,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        return {
            service: serviceName,
            url,
            ok: false,
            reachable: false,
            status: null,
            statusText: null,
            latencyMs,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
};

const expertSlidesLandingPageStatus = async () => {

    const serviceName = process.env.LANDING_PAGE_SERVICE_NAME || "expert-slides-landing-page";
    const url = `${process.env.LANDING_PAGE_URL}`;
    const startTime = Date.now();

    try {
        if (!process.env.LANDING_PAGE_URL) {
            throw new Error("LANDING_PAGE_URL is not configured in environment variables");
        }

        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const latencyMs = Date.now() - startTime;
        const reachable = isHealthyStatus(response.status);

        return {
            service: serviceName,
            url,
            ok: reachable,
            reachable,
            status: response.status,
            statusText: response.statusText ?? null,
            latencyMs,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        return {
            service: serviceName,
            url,
            ok: false,
            reachable: false,
            status: null,
            statusText: null,
            latencyMs,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
};

const expertSlidesDatabaseStatus = async () => {

    const url = `${process.env.BACKEND_SERVER_URL}/api/v1/health/db-status`;
    const serviceName = 'Expert Slides Database';
    const startTime = Date.now();

    try {

        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const latencyMs = Date.now() - startTime;
        const reachable = isHealthyStatus(response.status);

        return {
            service: serviceName,
            url,
            ok: reachable,
            reachable,
            status: response.status,
            statusText: response.statusText ?? null,
            latencyMs,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        return {
            service: serviceName,
            url,
            ok: false,
            reachable: false,
            status: null,
            statusText: null,
            latencyMs,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
};

const expertSlidesAIBackendStatus = async () => {

    const url = `${process.env.AI_BACKEND_SERVER_URL}/health-check`;
    const startTime = Date.now();
    const serviceName = process.env.BACKEND_AI_SERVICE_NAME || "expert-slides-backend-ai";

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const latencyMs = Date.now() - startTime;
        const reachable = isHealthyStatus(response.status);

        return {
            service: serviceName,
            url,
            ok: reachable,
            reachable,
            status: response.status,
            statusText: response.statusText ?? null,
            latencyMs,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        return {
            service: serviceName,
            url,
            ok: false,
            reachable: false,
            status: null,
            statusText: null,
            latencyMs,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
};

const expertSlidesLLMStatus = async (model) => {

    const url = `${process.env.AI_BACKEND_SERVER_URL}/test_llm?model=${model}`;
    const startTime = Date.now();
    const serviceName = `${process.env.BACKEND_AI_SERVICE_LLM_NAME} (${model})` || "expert-slides-llm";

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const latencyMs = Date.now() - startTime;
        const reachable = isHealthyStatus(response.status);

        return {
            service: serviceName,
            url,
            ok: reachable,
            reachable,
            status: response.status,
            statusText: response.statusText ?? null,
            latencyMs,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        const latencyMs = Date.now() - startTime;

        return {
            service: serviceName,
            url,
            ok: false,
            reachable: false,
            status: null,
            statusText: null,
            latencyMs,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
}

export {
    expertSlidesDatabaseStatus,
    expertSlidesBackendStatus,
    expertSlidesFrontendStatus,
    expertSlidesAIBackendStatus,
    expertSlidesLLMStatus,
    expertSlidesLandingPageStatus
};