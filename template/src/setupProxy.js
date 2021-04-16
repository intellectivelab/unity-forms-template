const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    const unityApiFilter = (pathname) => pathname.match('^/api') || pathname.match('^(/.*)?/public/api');
    const formsApiFilter = (pathname) => pathname.match('^/forms-api');
    const domainApiFilter = (pathname) => pathname.match('^/domain-api');

    app.use(createProxyMiddleware(formsApiFilter, {
        target: 'http://localhost:8082',
        pathRewrite: {'^/forms-api': ''}
    }));

    app.use(createProxyMiddleware(domainApiFilter, {
        target: 'http://localhost:4000'
    }));

    /**
     * Proxy setup to the running Unity application (Example)
     * Note: the .env file should have the same port as the running instance of Unity.
     * For example, if the Unity application is running on 9081 port, the .evn file should have 9081.
     */
    app.use(createProxyMiddleware(unityApiFilter, {
        target: 'http://192.168.0.201:9080/epermitting',
        pathRewrite: {
            '^/epermitting': '',
            '^/api': '/public/api'
        },
        auth: "p8admin_demo:V3ga123456"
    }));
};