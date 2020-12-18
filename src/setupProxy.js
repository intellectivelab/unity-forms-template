const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    const filter = (pathname) => pathname.match('^/api') || pathname.match('^(/.*)?/public/api');
    const formsApiFilter = (pathname) => pathname.match('^/forms-api');
    const deepApiFilter = (pathname) => pathname.match('^/deep-api');

	//-------------------------------------------------
    // Intellective
    app.use(createProxyMiddleware(formsApiFilter, {
        target: 'http://192.168.0.201:9080',
        //pathRewrite: {'^/api/1.0.0': '/api'}
    }));
    app.use(createProxyMiddleware(deepApiFilter, {
        target: 'http://localhost:4000'
    }));
    /**
     * Proxy setup to the running Unity application (Example)
     * Note: the .env file should have the same port as the running instance of Unity.
     * For example, if the Unity application is running on 9081 port, the .evn file should have 9081.
     */
    app.use(createProxyMiddleware(filter, {
        target: 'http://192.168.0.201:9080/epermitting',
        pathRewrite: {
            '^/epermitting': '',
            '^/api': '/public/api'
        },
        auth: "p8admin_demo:V3ga123456"
    }));
    //-------------------------------------------------

	//-------------------------------------------------
    // DEEP login
	// uncomment and replace code above with this one
	// update token & user variable
	// you can generate a new token using aggregator project / oauth-requests.http file

    // const applyHeaders = (request) => {
    //     const token = "<oAuthToken>"
    //     const user = "cn=dshakhovkin,ou=People,dc=epermit,dc=com"
    //     const userType = "EXTERNAL"
    //     if (token) {
    //         request.setHeader('Authorization', `bearer ${token}`)
    //         request.setHeader('deep-user-id', user)
    //         request.setHeader('deep-user-type', userType)
    //     }
    // };
    // app.use(createProxyMiddleware(formsApiFilter, {
    //     target: 'http://10.18.100.81:9080',
    //     onProxyReq: applyHeaders
    // }));
    // app.use(createProxyMiddleware(deepApiFilter, {
    //     target: 'http://10.18.100.81:9080',
    //     onProxyReq: applyHeaders
    // }));
    // app.use(createProxyMiddleware(filter, {
    //     target: 'http://10.18.100.81:9080/epermitting',
    //     pathRewrite: {
    //         '^/epermitting': '',
    //         '^/api': '/public/api'
    //     },
    //     logLevel: "debug",
    //     onProxyReq: applyHeaders
    // }));
	//-------------------------------------------------
};