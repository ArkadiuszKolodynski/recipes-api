# Recipes API

RESTful API to manage recipes.
Made with NestJS, Prisma & Elasticsearch.

## Prerequisites

- Running PostgreSQL instance
- Running Elasticsearch instance

## Usage

```sh
git clone https://github.com/ArkadiuszKolodynski/recipes-api.git
cd recipes-api
npm install
echo 'DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_ADDRESS>:<DB_PORT>/<DB_NAME>?schema=public"' > .env
echo 'ELASTICSEARCH_URL="http://<ES_HOST>:<ES_PORT>"' >> .env
npx prisma migrate dev
npm start
```

Then navigate to `http://127.0.0.1:3000/api` for API documentation.
