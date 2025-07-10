<!-- ABOUT THE PROJECT -->

## About The Project

This is a Restful API repository for Nibiru Digital Book. This Restful API is built using ExpressJS and PostgreSQL.

### Technology Used

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Cloudinary](https://cloudinary.com/)
- [Google APIs](https://github.com/googleapis/google-api-nodejs-client)
- [Google Auth Library](https://www.npmjs.com/package/google-auth-library)
- [Nodemailer](https://nodemailer.com/about/)
- [Winston](https://www.npmjs.com/package/winston) 

## Getting Started

### Installation

- Clone this project with `https://github.com/andry-pebrianto/nibiru-digital-book-server.git`
- Install package required with `npm install`
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

MIDTRANS_APP_URL=
MIDTRANS_SERVER_KEY=
FRONT_END_URL=
```

- Migrate database using `npm run migrate:up`

### Executing program

- Run program with `npm run dev` for development and `npm run start` for production (must be compiled first with `npm run compile`)

<!-- RELATED PROJECT -->

## Related Project

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
