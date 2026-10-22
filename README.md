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
| Frontend   | React 18, TypeScript, Vite, Redux Toolkit, React Router 7, Tailwind CSS, Chart.js (`react-chartjs-2`), Motion, Lucide icons |
| Backend    | Node.js, Express 4, TypeScript, express-validator, Helmet, JSON Web Tokens |
| Database   | PostgreSQL via Prisma ORM |
| Testing    | Vitest, React Testing Library |
| Deployment | Vercel: the frontend is served as static files and the Express API runs as a serverless function under `/api` |

Money is stored as integer cents. A shared `Money` class handles parsing, arithmetic and formatting on both the frontend and the backend, so no floating-point rounding errors creep in.

## Project structure

```
balance/
├── backend/            Express API
│   ├── prisma/         Prisma schema, migrations and seed data
│   └── src/
│       ├── routes/api/ account, category, session, tag, transaction, trend routes
│       └── utils/      auth, validation, Money class, helpers
├── frontend/           React app (Vite)
│   └── src/
│       ├── components/ Accounts, Budgets, Transactions, Trends, Landing, Main
│       ├── features/   Redux slices
│       ├── lib/        Shared UI component library
│       └── utils/      API client, thunks, helpers
├── package.json        Root scripts for installing and building both apps
└── vercel.json         Vercel build and routing config
```

## Getting started

### Prerequisites

- Node.js
- Yarn
- A PostgreSQL database

### Setup

1. Install dependencies for both apps:

   ```sh
   yarn install
   ```

2. Configure the environment:

   ```sh
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Fill in the database credentials, `JWT_SECRET` and `PORT` in `backend/.env`. The Prisma schema reads its connection string from `DATABASE_URL_SCHEMA`, so set that variable too. In `frontend/.env`, set `VITE_API_URL` to the backend's address.

3. Create the database schema and seed it:

   ```sh
   cd backend
   yarn push
   yarn seed
   ```

4. Start the backend and the frontend in separate terminals:

   ```sh
   cd backend && yarn dev
   cd frontend && yarn dev
   ```

### Scripts

| Location  | Command          | Description |
| --------- | ---------------- | ----------- |
| root      | `yarn build`     | Build the backend and the frontend |
| backend   | `yarn dev`       | Run the API with hot reload (nodemon) |
| backend   | `yarn migrate`   | Create and apply a Prisma migration |
| backend   | `yarn reseed`    | Drop the schema, push it again and reseed |
| frontend  | `yarn dev`       | Start the Vite dev server |
| frontend  | `yarn test`      | Run the tests with Vitest |
| frontend  | `yarn lint`      | Lint with ESLint |

## License

MIT
