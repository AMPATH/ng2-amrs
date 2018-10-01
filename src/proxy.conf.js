const PROXY_CONFIG = [
    {
        context: [
            "/test-amrs"
        ],
        target: "https://ngx.ampath.or.ke",
        secure: false
    },
    {
        context: [
            "/etl-latest",
        ],
        target: "http://localhost:8002",
        secure: false,
        pathRewrite: {
            "^/etl-latest": ""
          },
    }
]

module.exports = PROXY_CONFIG;