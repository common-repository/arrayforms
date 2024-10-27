(function ($) {
    $(function () {
        var userLoggedIn = false;
        var loginIframe = null;
        var loggedInIframeCheck = document.getElementById('array-logged-in-check-frame');
        var adminIframe = document.getElementById('array-admin-frame');
        var apiUrl = arrayforms_vars.arrayforms_webserver_url || 'https://www.buildarray.com';
        var arrayformsLoginUrl = document.getElementById('arrayforms-login-url').value;
        var arrayformsLoggedOutUrl = document.getElementById('arrayforms-logged-out-url').value;
        var arrayformsCurrentDomain = document.getElementById('arrayforms-current-domain').value;

        window.addEventListener('message', handleIncomingMessages);

        function getHostName(url) {
            var removeQueryString = url.split(/[?#]/)[0];
            var match = removeQueryString.match(/:\/\/(www[0-9]?\.)?(.[^\/:]+)/i);

            if (
                match != null &&
                match.length > 2 &&
                typeof match[2] === 'string' &&
                match[2].length > 0
            ) {
                return match[2];
            } else {
                return null;
            }
        }
        function getHostnameFromURL(url) {
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
        }

        function isSafeDomain(origin) {
            var domain = getHostnameFromURL(origin);
            var safeDomains = ['buildarray.com'];

            return safeDomains.some(function (safeOrigin) {
                return safeOrigin === domain;
            });
        }

        function buildarrayGet(settings) {
            return $.ajax({
                type: settings.method || 'GET',
                url: apiUrl + '/' + settings.endpoint,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Accept', 'application/json;version=1.04');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },
                data: settings.data || {}
            });
        }

        function handleIncomingMessages(event) {
            if (isSafeDomain(event.origin)) {
                if (event.data) {
                    if (typeof event.data.resized === 'object') {
                        if (adminIframe) {
                            adminIframe.style.height = event.data.resized.height + 'px';
                            adminIframe.classList.add('loaded');
                        }
                    }
                    if (typeof event.data.userLoggedIn !== 'undefined') {
                        userLoggedIn = event.data.userLoggedIn === true;
                        if (userLoggedIn) {
                            adminIframe.classList.add('loaded');
                        }
                    }
                    if (typeof event.data.windowLoaded !== 'undefined') {
                        windowLoaded = event.data.windowLoaded === true;
                        if (windowLoaded) {
                            adminIframe.classList.add('loaded');
                        }
                    }
                    if (typeof event.data.userSuccessfullyLoggedIn !== 'undefined') {
                        if (event.data.userSuccessfullyLoggedIn === true) {
                            sendMessageToAdminWindow({ 'closeWindow': true });
                            window.location.reload();
                        }
                    }
                    if (typeof event.data.userSuccessfullyLoggedOut !== 'undefined') {
                        if (event.data.userSuccessfullyLoggedOut === true) {
                            window.location.reload();
                        }
                    }
                    if (typeof event.data.cookiesAccepted !== 'undefined') {
                        if (event.data.cookiesAccepted === true) {
                            sendMessageToAdminWindow({ 'closeWindow': true });
                            window.location.reload();
                        }
                    }
                }
            }
        }

        function sendMessageToLoginWindow(message) {
            if (loginIframe) {
                var loginIframeUrl = loginIframe.src;
                if (isSafeDomain(loginIframeUrl)) {
                    loginIframe.contentWindow.postMessage(message, loginIframeUrl);
                }
            }
        }

        function sendMessageToAdminWindow(message) {
            if (adminIframe) {
                var adminIframeUrl = adminIframe.src;
                if (isSafeDomain(adminIframeUrl)) {
                    adminIframe.contentWindow.postMessage(message, adminIframeUrl);
                }
            }
        }

        function createAdminIframe() {
            if (!adminIframe) {
                var iframe = document.createElement('iframe');
                var contentBody = document.getElementById('wpbody-content');

                iframe.id = 'array-admin-frame';
                iframe.src =
                    arrayforms_vars.arrayforms_webserver_url +
                    '/frame/authorized?source=wordpress&domain=' +
                    arrayformsCurrentDomain +
                    '&target=' +
                    arrayformsLoginUrl +
                    '&fail=' +
                    arrayformsLoggedOutUrl;
                contentBody.appendChild(iframe);
                adminIframe = document.getElementById('array-admin-frame');
            }
        }
        createAdminIframe(); //creating the iframe via js to disable firefox caching the iframe
    });
})(jQuery);
