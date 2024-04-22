This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running Dialogue

You will need to have the following installed:

- Node.js v14.17.0 or later (https://nodejs.org/en/download/)
- npm or yarn (https://www.npmjs.com/get-npm) or (https://classic.yarnpkg.com/en/docs/install)

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, create a .env with the following:

```
NEXT_PUBLIC_TMDB_API_KEY=""
NEXT_PUBLIC_GMAPS_API_KEY=""
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
GOOGLE_MAPS_API_KEY=""
```

API keys can be obtained from the following sources:

- [TMDB](https://www.themoviedb.org/documentation/api)
- [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Firebase](https://firebase.google.com/docs/web/setup)

Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to browse Dialogue!
