const path = require("path");
const fs = require("fs");

// const SSL_PEM_FILEPATH =
//     process.env.SSL_PEM_FILEPATH || path.resolve(`${process.env.HOME}/.ssl/ssl.pem`);

const baseConfig = require("./webpack.config");

const config = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        // public: require('child_process').execSync('gp url 3000').toString().trim(),
        // hot: false,
        // liveReload: false,
        // magicHtml: false,
        static: {
            directory: "./dist",
        },
        // https: {
        //     key: fs.readFileSync(SSL_PEM_FILEPATH),
        //     cert: fs.readFileSync(SSL_PEM_FILEPATH),
        // },
        port: 5000,
        compress: true,
        allowedHosts: [".gitpod.io", ".githubpreview.dev"],
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        },
        client: {
            webSocketURL: {
                hostname: "0.0.0.0",
                pathname: "/ws",
                port: 443,
              },    
        }
    },
};

module.exports = Object.assign(baseConfig, config);