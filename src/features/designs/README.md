# SeatSnaps mobile UI

The four supplied HTML boards contain 80 screens. Their content, inline layout descriptions, local images and authored state handlers are imported into `generated/`. `NativeDesign.tsx` renders these descriptions with React Native views, text, images, inputs, switches, scroll containers and pressable controls. It does not embed the HTML or use a WebView.

- `DesignScreen.tsx`: screen composition, fixed footers, keyboard handling, validation and action routing.
- `navigation.ts`: explicit cross-board destinations. The source reused several artifact URLs for unrelated destinations, so these are mapped by screen and action.
- `model.ts` and `store.tsx`: observable screen state and shared in-memory demo state.
- `text.ts`: shared cart, city and profile values reflected across screens.
- `styles.ts`: conversion of the design's supported CSS layout properties to native styles.
- `generated/logic.js`: statically bundled authored interaction classes. No runtime evaluation or browser runtime is used.

Run `npm start` and open the app. New unauthenticated sessions enter onboarding. Every screen is also directly addressable at `/screens/A1` through the IDs in `DESIGN-SCREENS.md`. The footer's **All 80 screens** link opens a searchable library, including loading, error, empty and confirmation states. `/screens/C1` opens the home UI directly.

Use `npm run typecheck` and `npm run test:ui`. Regenerate the imported screen descriptions with `npm run ui:import`. The five checked-in Jakarta TTF weights were converted from the supplied variable WOFF2 font for native compatibility; they do not need conversion during normal development.

## Demo boundaries

This is the UI-first implementation requested for this pass. Demo form values, selections, profile edits and cart state last for the current app session. The original API-connected authentication and booking routes remain available separately; the screen library links to the original sign-in.

Payments, Google authentication, camera/gallery access, push/location permissions, wallet/calendar exports, actual support messages, actual refunds/transfers, and account deletion are not submitted to external services. Their screens and local feedback are available. Demo QR graphics are explicitly marked as invalid for entry. Do not enter real payment details in the demo.

The source exports omitted several dynamic `/_blob/` photographs. Those slots reuse photographs bundled in the other supplied screens; static source assets are preserved. Map pins and seat availability are fixture data. Browser rendering checks and native production bundling are not substitutes for a physical iOS/Android device check.
