import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    @font-face {
        font-family: 'Material-Design-Iconic-Font';
        src: url('https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/fonts/Material-Design-Iconic-Font.woff2') format('woff2'),
        url('https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/fonts/Material-Design-Iconic-Font.woff') format('woff'),
        url('https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/fonts/Material-Design-Iconic-Font.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    /* devanagari */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v12/pxiEyp8kv8JHgFVrJJbecmNE.woff2) format('woff2');
        unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
    }
    /* latin-ext */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v12/pxiEyp8kv8JHgFVrJJnecmNE.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v12/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* devanagari */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLGT9Z11lFc-K.woff2) format('woff2');
        unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
    }
    /* latin-ext */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLGT9Z1JlFc-K.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* devanagari */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: local('Poppins SemiBold'), local('Poppins-SemiBold'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLEj6Z11lFc-K.woff2) format('woff2');
        unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
    }
    /* latin-ext */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: local('Poppins SemiBold'), local('Poppins-SemiBold'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLEj6Z1JlFc-K.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: local('Poppins SemiBold'), local('Poppins-SemiBold'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* devanagari */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: local('Poppins Bold'), local('Poppins-Bold'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLCz7Z11lFc-K.woff2) format('woff2');
        unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
    }
    /* latin-ext */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: local('Poppins Bold'), local('Poppins-Bold'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLCz7Z1JlFc-K.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: local('Poppins Bold'), local('Poppins-Bold'), url(https://fonts.gstatic.com/s/poppins/v12/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
`;
