import axios from 'axios';

const buildarrayWebServerUrl =
    arrayforms_php_vars?.arrayforms_webserver_url || 'https://www.buildarray.com';

const testUrlForErrors = ({ url, onSuccess = () => {}, onError = () => {} }) => {
    axios
        .get(url)
        .then((response) => {
            if (response.status === 200) {
                //check for php error
                if (typeof response.data === 'object' || response.data.indexOf('<pre>') === -1) {
                    onSuccess(true);
                } else {
                    onError(500);
                }
            } else {
                console.log(response);
            }
        })
        .catch((error) => {
            const errorObject = error.toJSON();
            if (errorObject.message === 'Request failed with status code 404') {
                onError(404);
            }
        });
};

const getHostName = (url) => {
    var removeQueryString = url.split(/[?#]/)[0];
    var match = removeQueryString.match(/:\/\/(www[0-9]?\.)?(.[^\/:]+)/i);

    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
};

const getDomainName = (url) => {
    var hostName = getHostName(url);
    var domain = hostName;

    if (hostName != null) {
        var parts = hostName.split('.').reverse();
        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];
            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
                domain = parts[2] + '.' + domain;
            }
        }
    }

    return domain;
};

const isSafeOrigin = (origin) => {
    const domainName = getDomainName(origin);
    var safeOrigins = ['buildarray.com'];
    return safeOrigins.some((safeOrigin) => safeOrigin === domainName);
};

const getFormPreviewUrl = ({ formId }) => {
    return `${buildarrayWebServerUrl}/forms/internal/${formId}`;
};

const buildarrayApi = ({
    method = 'get',
    endpoint,
    overrideUrl = '',
    data = {},
    onSuccess = () => {},
    onLoadingStart = () => {},
    onLoading = () => {},
    onError = () => {}
}) => {
    const options = {
        method,
        url: overrideUrl || `${buildarrayWebServerUrl}/api/${endpoint}`,
        credentials: 'include',
        withCredentials: true,
        headers: {
            'Accept': 'application/json;version=1.04',
            'Content-Type': 'application/json'
        },
        data
    };
    onLoadingStart(true);
    onLoading(true);
    axios(options)
        .then((response) => {
            if (response.status === 200) {
                //check for php error
                if (typeof response.data === 'object' || response.data.indexOf('<pre>') === -1) {
                    if (typeof response.data[endpoint.slice(0, -1)] !== 'undefined') {
                        onSuccess(response.data[endpoint.slice(0, -1)]);
                    } else {
                        onSuccess(response.data instanceof Array || response.data instanceof Object ? response.data : []);
                    }
                } else {
                    onError(response);
                }
            } else {
                onError(response);
            }
            onLoading(false);
        })
        .catch((error) => {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                onError({ status: error.response.status, message: error.response.data });
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                onError(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                onError(error.message);
            }
        });
};

export {
    buildarrayApi,
    buildarrayWebServerUrl,
    testUrlForErrors,
    getFormPreviewUrl,
    isSafeOrigin,
    getDomainName
};
