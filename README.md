# Balance

Balance is a personal budgeting app. You record transactions across your accounts, put them into budget categories, and see where your money goes from month to month.

**Live site:** [balance.joshwanf.com](https://balance.joshwanf.com)

## Features

- **Accounts**: create, rename and delete checking and credit accounts. Each transaction belongs to one account.
- **Transactions**: record incoming and outgoing transactions with a payee, amount, date, account, category and any number of tags.
- **Search**: filter transactions with a query syntax that mixes free text with key/value filters, e.g. `coffee tags:"work, travel" startDate:2024-01-01`.
- **Budgets**: create spending categories and set a budgeted amount for each one per month. Each category shows what you have spent against its budget.
- **Tags**: label transactions with free-form tags for grouping that cuts across categories.
- **Trends**
  - *Overview*: a bar chart of incoming and outgoing totals by category over a range of months you choose.
  - *Compare*: pie charts that put two months' spending side by side, split by category.
- **Accounts and sessions**: sign up, log in and log out, with sessions kept in an HTTP-only JWT cookie.

## Tech stack

| Layer      | Technologies |
| ---------- | ------------ |
| App        | Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit, Tailwind CSS, Chart.js (`react-chartjs-2`), Motion, Lucide icons |
| API        | Next.js Route Handlers with REST endpoints under `/api`, zod validation, bcrypt password hashing, JSON Web Tokens |
| Database   | PostgreSQL via Prisma ORM |
| Deployment | Vercel, with the project's Root Directory set to `apps/web` |

Money is stored as integer cents. A `Money` class handles parsing, arithmetic and formatting, so no floating-point rounding errors creep in.

## Project structure

The repo is a yarn workspace with the app and a shared types package.

```
balance/
├── apps/web/                 Next.js app
│   ├── prisma/               Prisma schema, migrations and seed data
│   └── src/
│       ├── app/              Pages (/, /my-balance/...) and API routes (app/api)
│       ├── server/           Auth, Prisma client, error handling, queries
│       ├── components/       Accounts, Budgets, Transactions, Trends, Landing, Main
│       ├── features/         Redux slices
│       ├── store/            Redux store, created per client in Providers
│       ├── lib/              Shared UI component library
│       └── utils/            API client, thunks, helpers
├── packages/api-types/       Request and response types shared by the API and the client
└── package.json              Workspace root and scripts
```

## API

All endpoints are under `/api` and need a logged-in session except `GET`/`POST`/`DELETE /api/session`, `POST /api/users` and `GET /api/health`.

| Resource     | Endpoints |
| ------------ | --------- |
| Session      | `GET /session` (restore), `POST /session` (log in), `DELETE /session` (log out), `POST /users` (sign up) |
| Accounts     | `GET /accounts?startMonth=`, `POST /accounts`, `PATCH /accounts/:id`, `DELETE /accounts/:id` |
| Categories   | `GET /categories?startMonth=`, `POST /categories?startMonth=`, `GET`/`PATCH`/`DELETE /categories/:id`, `DELETE /categories?ids=a,b` |
| Transactions | `GET /transactions?startMonth=&endMonth=`, search with `?q=&startDate=&endDate=&tags=`, `POST /transactions`, `GET`/`PATCH`/`DELETE /transactions/:id` |
| Tags         | `GET /tags`, `POST /transactions/:id/tags`, `DELETE /transactions/:id/tags?names=a,b` |
| Trends       | `GET /trends/overview?startMonth=&endMonth=`, `GET /trends/compare?month1=&month2=` |

## Getting started

### Prerequisites

- Node.js 20.9 or later
- Yarn 1
- A PostgreSQL database

### Setup

1. Install dependencies from the repo root:

   ```sh
   yarn install
   ```

2. Configure the environment:

   ```sh
   cp apps/web/.env.example apps/web/.env
   ```

   Set `DATABASE_URL_SCHEMA` to your Postgres connection string and `JWT_SECRET` to a long random string. The app does not start without `JWT_SECRET`.

3. Apply the migrations and seed the demo data:

   ```sh
   yarn workspace @balance/web deploy-prisma
   yarn seed
   ```

   The demo user logs in with `admin` / `password`.

4. Start the dev server:

   ```sh
   yarn dev
   ```

### Scripts

Run these from the repo root.

| Command           | Description |
| ----------------- | ----------- |
| `yarn dev`        | Start the Next.js dev server |
| `yarn build`      | Generate the Prisma client and build the app |
| `yarn start`      | Serve the production build |
| `yarn type-check` | Type-check the app |
| `yarn migrate`    | Create and apply a Prisma migration |
| `yarn seed`       | Seed the demo user and data |

## License

MIT
