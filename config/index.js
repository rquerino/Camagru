module.exports = {
    port: process.env.PORT || 3000,
    db_url: process.env.DB_URL,
    secret: process.env.SECRET || 'Camagru42',
    email_secret: process.env.EMAIL_SECRET || 'Camagru42Email',
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSW
}