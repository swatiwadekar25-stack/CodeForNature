# TeraPlus

TeraPlus is a forest and biodiversity restoration platform. The project is
organized as separate frontend and backend applications.

## Backend Setup

Requirements:

- Node.js 20 or newer
- MongoDB

From the project root:

```bash
cd backend
npm install
cp .env.example .env
```

Set `MONGO_URI`, `PORT`, and `CLIENT_URL` in `backend/.env`, then start the
API:

```bash
npm run dev
```

## Seed Forest Data

The backend includes 12 sample Indian forest records for development. The
script requires a valid `MONGO_URI` and uses an upsert keyed by forest `name`
and `state`. It does not clear the collection, and repeated runs do not create
duplicate seed records.

Run it from `TeraPlus/backend`:

```bash
npm run seed
```

The seed data is mock environmental data intended for development. It can be
replaced later by satellite, fire detection, or AI-generated data sources.

## API Endpoints

```text
GET    /api/health
GET    /api/forests
GET    /api/forests/:id
POST   /api/forests
PUT    /api/forests/:id
DELETE /api/forests/:id
GET    /api/reports
GET    /api/reports/:id
POST   /api/reports
PUT    /api/reports/:id
DELETE /api/reports/:id
GET    /api/statistics
```