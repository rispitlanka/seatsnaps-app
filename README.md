# Welcome to your Expo app 👋

## Mobile browsing API integration

Home, Explore, category pages, event details, search results, venue details, and
the city picker use the backend configured by `EXPO_PUBLIC_API_URL`.

- Public lists: `/events`, `/event-categories`, `/event-venues`, `/cities`.
- Event discovery: `/events/search` with `where`, `when`, and `what` filters.
- Details: `/events/:id`, `/events/slug/:slug`,
  `/event-categories/slug/:slug`, and `/event-venues/:id`.

The backend does not expose keyword search. The app matches keywords against the
returned events (including category, organiser, tags, and location) and venues.
Date and category filters apply to events; city filters apply to both events and
venues. Choosing **All cities** removes the location restriction. Organiser
summaries and their event lists come from public event records.

These routes show loading, empty, and retry states and do not fall back to mock
records when the API fails. Missing artwork uses neutral placeholders. Home
retains its existing card/rail layout. Sample-only venue statistics, maps,
facilities, and event content have been removed from the integrated detail pages.

Ticket purchasing remains outside this integration. The event page displays
backend ticket information without opening the simulated checkout. Other account,
payment, ticket, and design-library screens may still use demo data.

Validation:

```bash
npm run typecheck
npm run test:catalog
# Optional read-only checks against EXPO_PUBLIC_API_URL in .env:
npm run test:catalog -- --live
# Verify native Android bundling; this does not create an APK:
npx expo export --platform android --output-dir /tmp/seatsnaps-catalog-android
```

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
