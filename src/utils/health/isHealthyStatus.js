const isHealthyStatus = (status) => {
    return status >= 200 && status < 400;
}

export default isHealthyStatus;