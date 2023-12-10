<!-- ABOUT THE PROJECT -->

## About The Project

This is a Restful API repository for Cari Buku. This Restful API is built using ExpressJS and PostgreSQL.

### Technology Used

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Cloudinary](https://cloudinary.com/)
- [Redis](https://redis.io/)
- [Google APIs](https://github.com/googleapis/google-api-nodejs-client)
- [Google Auth Library](https://www.npmjs.com/package/google-auth-library)
- [Nodemailer](https://nodemailer.com/about/)

## Getting Started

### Installation

- Clone this project with `https://github.com/andry-pebrianto/cari-buku-server.git`
- Install package required with `yarn`
- Setting .env

```bash
NODE_ENV=
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

EMAIL_FROM=
EMAIL_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_URI=
GMAIL_REFRESH_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

- Migrate database using `yarn run migrate:up`

### Executing program

- Run program with `yarn run dev` for development and `yarn run start` for production (must be compiled first with `yarn run compile`)

<!-- RELATED PROJECT -->

## Related Project

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
