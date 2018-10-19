const PROXY_CONFIG = [
    {
        context: [
            "/etl-server-test-internal2",
            "/amrs"
        ],
        target: "https://ngx.ampath.or.ke",
        secure: false
    }
]

module.exports = PROXY_CONFIG;