# Render Deployment

This repo is configured for Render with `render.yaml`.

## Deploy

1. Push this repository to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. When prompted, enter:
   - `CLIENT_ID`
   - `CLIENT_SECRET`
   - `MAPBOX_ACCESS_TOKEN`
4. Deploy the Blueprint.

Render will create:

- `safer-strava-web`: the Next.js frontend
- `safer-strava-api`: the FastAPI backend
- `safer-strava-db`: the Postgres database

## Strava Settings

In your Strava API application settings, set the authorization callback domain to your Render/custom domain. For the default Render URL, the callback URL is:

```text
https://safer-strava-web.onrender.com/api/py/auth/callback
```

If you attach your own domain, update the Render environment variables:

- Backend `FRONTEND_BASE_URL`: `https://yourdomain.com`
- Frontend `APP_BASE_URL`: `https://yourdomain.com`
- Frontend `NEXT_PUBLIC_APP_BASE_URL`: `https://yourdomain.com`

Then update the Strava callback URL to:

```text
https://yourdomain.com/api/py/auth/callback
```

## PostGIS

After the database is created, open a Render database shell and run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

The current app stores users and sessions with plain SQLAlchemy tables, but this keeps the Render database aligned with the local PostGIS setup.
