# SeatSnaps UI design audit

Checked against the four HTML boards supplied on 28 October 2026.

**Result: not certified as a 100% visual match.** All 80 references and their corresponding app views/states were captured at 390px width with isolated browser fixtures. There were no uncaught JavaScript errors during these captures. This does not establish Android pixel parity or backend feature completeness.

## Changes made

- Restored the original compositions for Explore categories/organisers/venues, category lists, organiser profiles, search, search results, event detail, venue detail and city selection. Live API loaders remain in place; design view models use backend IDs and values.
- Kept the bounded screen and fixed bottom-tab layout from the scroll fix. Category tiles now keep two-column sizing even with an odd number of API records.
- Corrected the Notifications back-button size/header offset.
- Implemented the distinct compact L4 invalid-promo layout and returned empty Following to its reference default tab.
- The I6/I7/I8 preview routes now render the actual native state components instead of the generic imported renderer. Their backend lifecycle integration remains separate.

## Remaining limits

- The exported source references **nine missing photo paths across eleven screens**: C1, C2, C3, C5, C7, D1, E4, F1, H2, H5, L10. Retaining backend images or substitute bundled photos cannot produce exact photo parity. Original files or complete exports are required.
- Live event titles, counts, images, venues, user names, amounts, ticket availability and dates differ from the example board data. The app must keep using actual backend records rather than counterfeit the samples.
- Validation can disable a button that is enabled in a static board (for example L3). Animation, timers and form input must be compared in the same state.
- Full-scroll pages, keyboard-open layouts, system safe areas, font rendering and Android navigation-bar behavior need device screenshot verification. Browser screenshots alone are insufficient.
- API-inaccessible event states and features that are still demos are not made functional merely by restoring their UI. Booking/payment completion is outside this change.
- The existing APK needs a rebuild; this pass does not replace the installed artifact.

## Evidence

The side-by-side gallery and all 160 captures are in [the local comparison folder](/tmp/seatsnaps-ui-audit/review.html). This folder is temporary and is not packaged into the app or uploaded to EAS. Reference photos that were already broken in the supplied HTML are visible as broken slots in that gallery.

Validation: TypeScript, the 80 imported screen-tree/asset/navigation checks, catalog view-model tests, and Android production bundling.

## Screen coverage

“Captured” means rendered for inspection; it does not mean visually approved. Numeric image differences are deliberately not treated as design-match scores because API content and runtime states differ.

| ID | Board | Screen | Route | Notes |
| --- | --- | --- | --- | --- |
| A1 | 1 | Splash | / | Animation timing affects pixels |
| A2 | 1 | Splash loading | / | Animation timing affects pixels |
| A3 | 1 | Sign in | /login | Captured; native-device visual sign-off pending |
| A4 | 1 | Create account · 1 | /signup | Captured; native-device visual sign-off pending |
| A5 | 1 | Create account · 2 | /signup-details | Captured; native-device visual sign-off pending |
| B1 | 1 | Onboarding · Discover | /onboarding | Captured; native-device visual sign-off pending |
| B2 | 1 | Onboarding · Seats | /onboarding | Captured; native-device visual sign-off pending |
| B3 | 1 | Onboarding · Tickets | /onboarding | Captured; native-device visual sign-off pending |
| B4 | 1 | Welcome (alternative) | /welcome | Captured; native-device visual sign-off pending |
| C1 | 1 | Home (full scroll) | / | API content differs from the board fixtures; Reference has missing photo paths; Full-scroll/device comparison still required |
| C2 | 1 | Explore · Categories | /explore | API content differs from the board fixtures; Reference has missing photo paths |
| C3 | 1 | Category · Concerts | /explore/category/concerts | API content differs from the board fixtures; Reference has missing photo paths |
| C4 | 1 | Explore · Organisers | /explore?tab=Organisers | API content differs from the board fixtures |
| C5 | 1 | Organiser profile | /explore/organiser/org | API content differs from the board fixtures; Reference has missing photo paths |
| C6 | 1 | Search | /search | API content differs from the board fixtures |
| C7 | 1 | Search results | /results?q=jazz | API content differs from the board fixtures; Reference has missing photo paths |
| C8 | 1 | Filters sheet | /filters | Captured; native-device visual sign-off pending |
| D1 | 1 | Event detail (full scroll) | /event/tamil-fest-2026 | API content differs from the board fixtures; Reference has missing photo paths; Full-scroll/device comparison still required |
| D2 | 1 | Select tickets | /event/tamil-fest-2026/select | Captured; native-device visual sign-off pending |
| D3 | 1 | Choose section | /event/tamil-fest-2026/section | Captured; native-device visual sign-off pending |
| D4 | 1 | Pick seats | /event/tamil-fest-2026/seats | Captured; native-device visual sign-off pending |
| D5 | 1 | Checkout | /event/tamil-fest-2026/checkout | Captured; native-device visual sign-off pending |
| D6 | 1 | Booking confirmed | /booking/confirmed | Captured; native-device visual sign-off pending |
| D7 | 1 | E-ticket | /booking/ticket | Captured; native-device visual sign-off pending |
| E1 | 2 | Venue (full scroll) | /explore/venue/venue | API content differs from the board fixtures; Full-scroll/device comparison still required |
| E2 | 2 | Profile | /account | Captured; native-device visual sign-off pending |
| E3 | 2 | My tickets & bookings | /me/tickets | Captured; native-device visual sign-off pending |
| E4 | 2 | Saved events | /me/saved | Reference has missing photo paths |
| E5 | 2 | Payment methods | /me/payments | Captured; native-device visual sign-off pending |
| E6 | 2 | Notifications | /me/notifications | Captured; native-device visual sign-off pending |
| E7 | 2 | Account settings | /me/account | Captured; native-device visual sign-off pending |
| E8 | 2 | Security | /me/security | Captured; native-device visual sign-off pending |
| F1 | 2 | Promotions (tab) | /promotions | Reference has missing photo paths |
| F2 | 2 | Promotion detail | /promo/earlybird | Captured; native-device visual sign-off pending |
| G1 | 2 | Forgot password | /forgot-password | Captured; native-device visual sign-off pending |
| G2 | 2 | Verification code | /verify-code | Captured; native-device visual sign-off pending |
| G3 | 2 | New password (error state) | /reset-password | Mismatch state entered using test passwords |
| G4 | 2 | Change password | /me/change-password | Captured; native-device visual sign-off pending |
| G5 | 2 | Location permission | /location | Captured; native-device visual sign-off pending |
| G6 | 2 | City picker | /city | API content differs from the board fixtures |
| G7 | 2 | Push permission | /push | Captured; native-device visual sign-off pending |
| H1 | 3 | Notifications inbox | /inbox | Captured; native-device visual sign-off pending |
| H2 | 3 | Map view | /map | Reference has missing photo paths |
| H3 | 3 | Search · no results | /results?q=nomatch | API content differs from the board fixtures |
| H4 | 3 | Date picker | /dates | Captured; native-device visual sign-off pending |
| H5 | 3 | Explore · Venues | /explore?tab=Venues | API content differs from the board fixtures; Reference has missing photo paths |
| I1 | 3 | General admission tickets | /event/ga/admission | Captured; native-device visual sign-off pending |
| I2 | 3 | Free RSVP | /event/rsvp/rsvp | Captured; native-device visual sign-off pending |
| I3 | 3 | Payment processing | /booking/processing | Animation timing affects pixels |
| I4 | 3 | Payment failed | /booking/failed | Captured; native-device visual sign-off pending |
| I5 | 3 | Seat hold expired | /booking/expired | Captured; native-device visual sign-off pending |
| I6 | 3 | Sold out + waitlist | /screens/I6 | Native design-state preview; backend status flow not connected |
| I7 | 3 | Event cancelled | /screens/I7 | Native design-state preview; backend status flow not connected |
| I8 | 3 | Event postponed | /screens/I8 | Native design-state preview; backend status flow not connected |
| I9 | 3 | Sign in to book | /sign-in-to-book | Captured; native-device visual sign-off pending |
| J1 | 3 | Booking detail | /me/booking/booking | Captured; native-device visual sign-off pending |
| J2 | 3 | Send a ticket | /me/booking/send | Captured; native-device visual sign-off pending |
| J3 | 3 | Request refund | /me/booking/refund | Captured; native-device visual sign-off pending |
| J4 | 3 | Gate mode (offline QR) | /me/booking/gate | Captured; native-device visual sign-off pending |
| J5 | 3 | Help & FAQ | /help | Captured; native-device visual sign-off pending |
| J6 | 3 | Contact support | /contact | Captured; native-device visual sign-off pending |
| J7 | 3 | Terms & privacy | /legal | Captured; native-device visual sign-off pending |
| J8 | 3 | Become an organiser | /become-organiser | Captured; native-device visual sign-off pending |
| J9 | 3 | Sign out confirm | /sign-out | Captured; native-device visual sign-off pending |
| J10 | 3 | Delete account confirm | /delete-account | Captured; native-device visual sign-off pending |
| K1 | 4 | No internet | /offline | Captured; native-device visual sign-off pending |
| K2 | 4 | Force update | /update | Captured; native-device visual sign-off pending |
| K3 | 4 | Maintenance | /maintenance | Captured; native-device visual sign-off pending |
| L1 | 4 | Pick a show (multi-date) | /event/multi/shows | Captured; native-device visual sign-off pending |
| L2 | 4 | Verify email (sign-up) | /verify-email | Captured; native-device visual sign-off pending |
| L3 | 4 | Add a card | /me/add-card | Save button is disabled until card input is valid |
| L4 | 4 | Checkout · invalid promo | /event/event/checkout | State reached through actual interaction |
| L5 | 4 | Rate the event | /me/rate | Captured; native-device visual sign-off pending |
| L6 | 4 | Past booking (attended) | /me/booking/past | Captured; native-device visual sign-off pending |
| L7 | 4 | Saved · empty | /me/saved | State reached through actual interaction |
| L8 | 4 | Inbox · empty | /inbox?empty=1 | Captured; native-device visual sign-off pending |
| L9 | 4 | Following · empty | /me/following | State reached through actual interaction |
| L10 | 4 | Following | /me/following | Reference has missing photo paths |
| L11 | 4 | Profile photo picker | /photo | Captured; native-device visual sign-off pending |
| L12 | 4 | Shared link · mobile web | /shared/event | Captured; native-device visual sign-off pending |

## Original photo files needed for exact image parity

These paths are referenced by the source components but their bytes are absent from the supplied exports.

| Source path | Screens |
| --- | --- |
| `/_blob/38d8301699fbd525716d5ddf2cd98a11` | C1, C2, C3, C5, C7, H2 |
| `/_blob/3fec09965edaaddb40a4fab0940dad5b` | C1, C2, D1, F1, H2, H5 |
| `/_blob/49d4b856f575dc51c032b2e2e9d3f601` | H5, L10 |
| `/_blob/75c35a92ae5359f8b42a69b932c7590a` | C1, C2, C3, C5, C7 |
| `/_blob/91bf1841d4c8406abbd784267d171479` | C1, C2, C3, C5, D1, E4, F1, H2 |
| `/_blob/bd7dc1449b1f824e5dc30205fbff2f77` | C1, C2, H2 |
| `/_blob/be55be5a266eff72addd53c16a5d112b` | C1, C2, C7, E4, H2, H5 |
| `/_blob/e1eb3776c653bdbf1992ac3e94d7cb67` | C1, C2, E4, F1, H2, H5 |
| `/_blob/f1f81e751b97d500437d51ca82299234` | C1, C2, C3, C5, D1, H5, L10 |
