if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const environment = process.env

module.exports = {
    port: environment.PORT,
    jwtSecret: environment.JWT_SECRET,
    db: {
        uri: environment.DB_URL,
        port: environment.DB_PORT,
        name: environment.DB_NAME
    }
}