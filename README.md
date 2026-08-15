# دفتر (Daftar) — React Native / Expo implementation

A full React Native (Expo, TypeScript) implementation of the "دفتر" personal finance / expense
tracker app, built from the Claude Design handoff bundle (`design_handoff_expense_tracker/`).
Every screen and data flow documented in that handoff's README is implemented natively —
not by embedding the HTML prototype.

## Running it

```bash
npm install
npm run start      # then press i / a / w, or scan the QR code with Expo Go
```

Requires Node 22+. No native build step is needed to try it — everything runs through Expo Go
or an Expo Dev Client.

## Project layout

```
App.tsx                        # font loading, providers, root shell
src/
  theme/                       # design tokens (colors/radius/shadow/fonts), light+dark, RTL helper
  i18n/                        # bilingual string dictionary (ar/en), ported from the prototype
  data/
    types.ts                   # domain types
    constants.ts, seed.ts      # categories, tips, currencies, seed/mock data
    store.tsx                  # global state: React Context + useReducer, one action per
                                # user-facing operation (mirrors the prototype's methods 1:1)
    selectors.ts                # derived/computed view-model data (the port of renderVals())
    helpers.ts                  # date/period/format helpers ported verbatim from the prototype
    backup.ts                   # export/import JSON backup (expo-file-system + expo-sharing)
  components/                  # shared UI primitives (Card, Button, Tag, ProgressBar, CategoryIcon...)
  navigation/                  # React Navigation stack + custom floating tab bar with FAB
  screens/                     # one file per screen
  sheets/                      # bottom-sheet modals (add/edit transaction, quick-log, currency picker)
```

## Architecture notes / how this differs from the HTML prototype

The prototype kept *all* state — including transient form-draft fields and which loan/
installment is currently "selected" — in one component's `state`, because it had no router.
This port instead:

- Uses **React Navigation** for screen state. Which loan or installment plan is open travels
  as a route param (`LoanDetail: { loanId }`) instead of a `selectedLoanId` field in global
  state.
- Keeps only genuinely cross-screen state in the global store (the add/edit transaction sheet,
  domain data like transactions/debts/loans, settings). Per-screen form drafts (new debt name,
  new loan participant rows, etc.) are local `useState` in the screen that owns them.
- The reducer in `src/data/store.tsx` is a close 1:1 port of the prototype's methods
  (`saveTransaction`, `payDebtInstallment`, `createSharedLoan`, `runLottery`'s ordering logic,
  `periodsFor`, `collectAutoTasks`, etc.) — same branching, same edge cases (e.g. the
  asymmetric debt-as-payment-method behavior for income vs. expense transactions).

## Known simplifications (flagged for follow-up, not oversights)

- **No `react-native-reanimated` / `react-native-gesture-handler`.** All animation (splash
  fade-in, bottom-sheet slide, lottery spin/reveal) uses React Native's built-in `Animated`
  API instead, and sheets use the built-in `Modal`. This was a deliberate call to keep the
  native dependency surface small and avoid needing a device/emulator in this environment to
  verify a reanimated Babel-plugin setup. Swapping in reanimated later for smoother/native-
  thread animation is a drop-in change, not a rewrite.
- **Budget category limits use a +/− 50 stepper, not a drag slider.** RN core dropped
  `<Slider>`; wiring `@react-native-community/slider` is straightforward if you want the
  exact drag interaction back.
- **RTL is handled per-screen** (`flexDirection: 'row-reverse'` etc. via `src/theme/rtl.ts`),
  not via RN's global `I18nManager.forceRTL` (which requires a reload and affects native
  chrome like the back-swipe gesture edge). This matches the app's actual behavior (Arabic by
  default, an in-app EN toggle) better than a global native RTL flip would.
- **"Today"** uses the real device date (`src/data/helpers.ts#today()`), per the handoff
  README's own instruction to replace the prototype's hardcoded mock date in production. Seed
  transactions/debts/etc. keep their original fixed demo dates.
- **Shared-loan participant invites**: the phone field + pending→accepted simulation is wired
  up (see `LoansScreen.tsx`), matching the documented behavior.
- Multi-currency, dark mode, bilingual UI (partial coverage per the handoff spec), auto-charity,
  live-rates strip (simulated), savings goals, customer installments, upfront commitments,
  auto-generated tasks, and JSON backup export/import are all implemented.

## Verification performed

- `npx tsc --noEmit` — clean, no type errors.
- `npx expo export --platform ios` — bundles successfully (1046 modules, no resolution/runtime
  bundling errors).
- Not verified: on-device/simulator visual QA (no device or simulator available in the build
  environment). Recommend a pass in Expo Go for the animation timing (sheet slide, lottery
  reveal stagger) and RTL layout before shipping.
