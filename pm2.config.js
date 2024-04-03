module.exports = {
    apps : [{
        name : "next-app",
        script : "npm run start",
        time : true,
        log_date_format : "YYYY-MM-DD HH:mm:ss.SSS",
        instances: 0,
        env_local: {
            APP_ENV: 'local',
            NEXTAUTH_URL: 'http://localhost:3000'

        },
        env_dev: {
            APP_ENV: 'dev',
            NEXTAUTH_URL: 'http://localhost:3000'
        },
        env_prod: {
            APP_ENV: 'prod',
            NEXTAUTH_URL: 'http://34.64.241.212/'
        }
    }]
}