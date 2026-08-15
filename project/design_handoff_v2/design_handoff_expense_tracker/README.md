# Handoff: تطبيق إدارة المصاريف والدخل (Personal Finance / Expense Tracker App)

## Overview
A mobile personal-finance app (Arabic, RTL) for tracking daily expenses and income, managing salary/freelance income, monthly budgets per category, shared group loans between coworkers/friends (with a payment tracker and a random draw for payout order), task/reminder planning, and rotating motivational financial tips grounded in the user's real data (top spending category, savings rate, budget alerts, outstanding debts).

## About the Design Files
The files in this bundle (`app.dc.html`, `Icon.dc.html`) are **design references built in HTML** — interactive prototypes showing intended look, layout, and behavior. They are **not production code to copy directly**. The task is to **recreate these designs in the target codebase's environment** — Flutter or React Native, per the client's choice — using that framework's own idioms (widgets/components, state management, navigation) rather than embedding or wrapping the HTML.

Open `app.dc.html` directly in a browser to see the live interactive prototype (all screens, all state transitions, all forms actually work against in-memory mock data).

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and shadows below are final — implement pixel-close using the target framework's styling system (Flutter `ThemeData`/`BoxDecoration`, or React Native `StyleSheet`).

## Design Tokens

### Colors (violet fintech palette)
- Accent (primary): `#6c5ce7`
- Accent ramp: 100 `#eeecfb`, 200 `#d8d3f5`, 300 `#b7aeec`, 400 `#9285e0`, 500 `#6c5ce7`, 600 `#5943d3`, 700 `#4632b0` (text-on-tint), 800 `#33248a`, 900 `#211862`
- Text (ink): `#14142b`
- Background (app canvas): `#f6f5fb`
- Surface (cards): `#ffffff`
- Divider/hairline: `rgba(20,20,43,0.1)`
- Neutral ramp: 100 `#fbfbfe`, 200 `#f0eef9`, 300 `#e2dff2`, 400 `#c9c4e3`, 500 `#a9a2cf`, 600 `#8b82b8`, 700 `#6b6291`, 800 `#2f2b4d`, 900 `#1c1a33`
- Positive/income text: accent-700 `#4632b0`
- Negative/expense text: base text color `#14142b` (no red — app deliberately avoids red for expenses)
- Dark mode overrides: surface `#211f38`, text `#f0eefb`, divider `rgba(240,238,251,0.14)`, neutral-200 `#2b2847`

### Category tile colors (duotone: pastel bg + darker icon of same hue)
- طعام Food: bg `#ffe8b3` / icon `#b5790a`
- نقل Transport: bg `#cdeafc` / icon `#1f6fb0`
- فواتير Bills: bg `#d7f5df` / icon `#1f8a4c`
- تسوق Shopping: bg `#ffd9df` / icon `#c23566`
- صحة Health: bg `#ffe0d6` / icon `#d9542a`
- راتب Salary: bg `#e3ddfb` / icon `#5b3fc4`
- دخل إضافي Freelance: bg `#d7f0f7` / icon `#157a8a`
- هدايا/أخرى Gift: bg `#f9d9ff` / icon `#a531c2`
- أخرى Generic tag: bg `#ececf2` / icon `#5b5b66`
- Custom user-created categories reuse this same palette, keyed by chosen icon.

### Typography
- Single family throughout: **Cairo** (Google Fonts, weights 400/500/600/700/800) — geometric, modern, full Arabic support.
- Headings: Cairo Bold (700), tight letter-spacing (-0.01em).
- Body: Cairo Regular/Medium (400/500).
- Balance figure (hero number): 36px / 700.
- Screen titles (h1): 22–24px / 700.
- Section headers (h4): 15px / 600.
- Body/list text: 13–14px / 400–500.
- Micro labels (kickers, nav labels): 10–11px.

### Radius & Shadow
- Card radius: 20–24px. Hero/gradient cards: 24px. Pills/chips/tags: fully rounded (100px or `--radius-sm` ≈ 12px on small controls).
- Bottom sheet: rounded top corners only, 28px.
- Shadows: sm `0 2px 8px rgba(31,24,80,0.08)`, md `0 8px 22px rgba(31,24,80,0.12)`, lg `0 20px 44px rgba(31,24,80,0.18)`.
- Icons: bold rounded-stroke line icons (stroke-width ~2.2, round caps/joins) for chrome/nav; **filled duotone tiles** (colored rounded-square bg + darker filled glyph) for category icons.

### Layout
- Single-column mobile layout, base width 390px (iPhone-class), RTL (`dir="rtl"`, Arabic).
- Bottom tab bar: 5 destinations (Home, Analytics, [+] FAB, Budget, Settings) — floating rounded-top bar, FAB is a circular accent button raised above it.
- Content padding: 20px horizontal.
- Card grids: `grid-template-columns: 1fr 1fr` or `1fr 1fr 1fr` with 8–10px gap.

## Screens / Views

### 1. الرئيسية (Home / Dashboard)
- Header: greeting-less title "لوحة التحكم" + current date, settings-gear button (circular, accent-100 bg) top-left (RTL: visually right).
- **Balance hero card**: full-width, violet gradient (`linear-gradient(135deg,#c9c2f0,#6c5ce7)`), white text, 24px radius, decorative blurred circle top-left. Shows: "الرصيد المتاح" label + eye toggle to hide/mask balance (`••••••`), big balance number, two inline sub-cards (income this month / expense this month) in translucent white overlay.
- **Quick-link grid**: 2 rows × 3 colorful rounded tiles (18px radius) linking to: سجل الراتب (income log), الميزانية (budget), النصائح (tips), الديون (debts), المهام (tasks), سلف مشتركة (shared loans). Each tile: distinct pastel bg + darker icon of same hue + label.
- **Tip-of-the-day banner**: gradient lavender card, pill badge "نصيحة اليوم" with lightbulb icon, pill "تحديث" (refresh/cycle) button, bold title + body. Content rotates through: data-driven insights (top category, savings rate vs 20% benchmark, budget-limit warnings, outstanding debt reminders) interleaved with static income-growth and savings tips.
- **Recent transactions list**: last 6 transactions (income + expense mixed), each row: colored category icon tile, title/note, category+date meta, amount (accent-700 if income, text color if expense, always with +/- prefix), pencil "edit" icon button (opens the add/edit sheet prefilled).
- "عرض الكل" link → Analytics screen.

### 2. التحليلات (Analytics)
- Segmented control: أسبوع / شهر / سنة (week/month/year) — visual only in the prototype, doesn't refilter data.
- Horizontal scrollable category filter chip row (icon + name), "الكل" (all) is default.
- When a specific category chip is selected: a detail card appears above the breakdown — icon, category name, 3 stats (total, transaction count, average per transaction), and a mini list of that category's transactions.
- Two stat cards: filtered/total expense, total income.
- "التوزيع حسب الفئة" (breakdown by category): horizontal bar list, each row = name, %, amount, and a progress bar (accent fill on neutral-200 track) sized relative to the largest category.
- "الاتجاه الأسبوعي للمصروف" (weekly trend): 7 vertical bar chart (accent-500 bars) with day-of-month labels, height proportional to that day's spend.

### 3. سجل الراتب والمداخيل (Income log)
- "+ دخل جديد" button top-left opens the add sheet pre-set to income mode.
- "الراتب الشهري الثابت" card: shows the fixed monthly salary figure.
- "كل المداخيل": full list of income entries (title, category+date, amount in accent-700, pencil edit button).

### 4. الميزانية الشهرية (Monthly budget)
- Overall budget usage card: total spent / total budget, single progress bar.
- Per-category rows ("حدود الفئات — اسحب للتعديل"): icon, name, spent/limit label, progress bar, and a native `<input type="range">` slider (0–3000 step 50) to adjust that category's monthly limit live.

### 5. نصائح وتقنيات مالية (Tips & techniques)
- Large "بطاqة اليوم" gradient card (same tip pool as home banner) with an index counter ("N / total") and a "تحديث" cycle button.
- "كل التقنيات" archive: a scrollable list of every tip title (data-driven + income-growth + general savings tips), clicking one jumps the featured card to it; the currently-shown tip is highlighted in accent-700.

### 6. الديون (Debts — personal, 1:1)
- Two summary cards: "يطلبني" (owed to me, unsettled total) and "أنا مدين" (I owe, unsettled total).
- "إضافة دين جديد" form: direction toggle (يطلبني / أنا مدين), name, amount, optional note, submit.
- Two lists ("يطلبني" / "أنا مدين"): each row = person, note, amount, and a "تحديد كمسدد" / "إلغاء التسديد" toggle button that strikes the row through (45% opacity + line-through) when settled.
- Empty-state copy shown when a list has zero entries.
- Note: adding an expense transaction with "طريقة الدفع" = "دين" (see Add sheet) auto-creates an "أنا مدين" entry here.

### 7. المهام والتذكيرات (Tasks & reminders)
- "تخطيط اليوم" subheader with today's date.
- Progress card: "N من M مهام اليوم منتهية" + progress bar.
- Add-task form: title, date picker, priority segmented control (منخفضة/متوسطة/عالية → tag styles: neutral/accent/outline respectively).
- "اليوم" list and "قادم" (upcoming, date-sorted) list: each row = a 22px rounded checkbox (filled accent + white checkmark when done, strikes the title through), title, and a priority tag; upcoming rows also show the date.
- Empty-state copy for both lists when empty.

### 8. السلف المشتركة (Shared/group loans) — the most complex feature
Two sub-screens:

**8a. List + create** (`isLoans`)
- "+ سلفة جديدة" toggles a creation form: name, total amount, start date, end date, frequency segmented control (شهري monthly / أسبوعي weekly), and a **dynamic participant list** — each row is (name text input, share/payment amount number input, remove button if >2 rows), plus "+ مشارك آخر" to add more rows. Requires ≥2 valid participants (name + amount>0) to submit. On submit, generates the payment schedule (see below) and jumps straight into the detail screen.
- Below the form: a card per existing shared loan (button-shaped card) showing name, frequency tag, participant count, total amount, and a payments-completed progress bar/label ("paid / total slots").
- Empty-state copy when no shared loans exist.

**8b. Detail** (`isLoanDetail`)
- Back button → list.
- Header: loan name, date range (`DD/MM/YYYY – DD/MM/YYYY`), frequency, and period count ("N دفعة").
- Two stat cards: total amount, participant count.
- **"قرعة الترتيب" (payout-order lottery)**: opens a centered modal with a spinning compass/wheel icon (CSS `spin` keyframe while active), a "بدء القرعة"/"إعادة القرعة" button. On start, participants are shuffled (`Array.sort(() => Math.random()-0.5)`) and revealed one-by-one with a staggered ~450ms delay per name (each appearing with a fade-in), each tagged with its final rank (#1, #2, …). The resulting order is persisted on the loan and shown back on the detail screen as a horizontal row of "#N name" pills.
- **Payment grid**: an HTML `<table>` — rows = participants (name, share amount, and their draw rank), columns = one per scheduled period (see period generation below). Each cell is a 28×28 rounded button; tapping toggles that participant's payment for that period between paid (accent-filled with a white checkmark) and unpaid (white, hairline inset border). This is the core "checkbox per person per period, marked ✓ when paid" requirement.

**Period generation logic** (`periodsFor(loan)` — must be reimplemented in the target codebase):
- `monthly`: one period per calendar month from `startDate`'s month through `endDate`'s month inclusive (labels "دفعة 1", "دفعة 2", …), capped at 36.
- `weekly`: `ceil(days between start/end ÷ 7)` periods (labels "أسبوع 1", "أسبوع 2", …), capped at 52.
- Always at least 1 period.

### 9. الإعدادات/الملف الشخصي (Settings)
- Avatar placeholder (initial letter) + name/email placeholder.
- Card: currency (read-only tag, driven by an app-level setting/prop), إشعارات (notifications) toggle switch, الوضع الليلي (dark mode) toggle switch — both are pill switches (42×24, thumb slides between left/right, track fills accent when on).
- "تسجيل الخروج" (log out) secondary button (no-op in the prototype).

## Interactions & Behavior

### Add/Edit transaction bottom sheet (used from the FAB, "+ دخل جديد", and every transaction's pencil icon)
- Slides up from the bottom (`sheetUp` 0.2s ease-out), rounded top corners (28px), drag-handle bar at top, close (×) button (circular accent-100).
- Segmented control: مصروف (expense) / دخل (income) — switches which category set is shown.
- Amount field: large numeric input (26px/700 weight).
- **Category picker**: a 4-column grid of colorful tiles (icon + name), selected tile gets a 2px accent border + slight scale-up (1.04); a dashed "+ فئة جديدة" tile is appended for expense categories only, which reveals an inline sub-form (name + a palette of icon choices) to create a new custom expense category (persists with its own color/icon and a default 300 budget limit).
- Optional note field, date field (defaults to today).
- طريقة الدفع (payment method) segmented: كاش (cash) / دين (debt) — selecting "دين" reveals a "الجهة / الشخص" (payee name) field; submitting in this mode both records the transaction AND creates a matching "أنا مدين" entry on the Debts screen.
- Primary "حفظ العملية" / "حفظ التعديلات" button (label changes when editing vs. creating) is always visible/enabled; a helper caption below it explains why save is a no-op ("أدخل المبلغ واختر الفئة لتفعيل الحفظ") until both amount>0 and a category are set.
- When opened via a transaction's pencil icon, the sheet is pre-filled and gains a "حذف العملية" (delete) secondary button.
- Tapping the backdrop or × closes the sheet without saving.

### Global
- Bottom tab bar: 5 destinations; the active tab gets an accent-100 pill background behind its icon+label (not just a color change).
- Dark mode toggle (Settings) re-themes the whole app by overriding a handful of CSS custom properties (surface/text/divider/neutral-200) scoped to the phone frame — no per-component dark styling needed if the target framework mirrors this "theme token override" approach (e.g. Flutter `ThemeData.dark()`, or a React context toggling a token map).
- Currency is a single configurable value appended to every formatted amount (default "د.ع" / Iraqi Dinar); amounts are formatted with thousands separators, no decimals.
- "امس/اليوم" date handling is currently hardcoded around a fixed mock "today" (`2026-08-11`) — replace with real device date in production.

## State Management
Everything lives in one component's local state in the prototype (a single class with `state = {...}` and a `renderVals()` derived-data pass). For a real app, model as (suggested, per screen/domain):
- `transactions[]` — `{id, type: 'income'|'expense', categoryId, amount, note, date, method: 'cash'|'debt'}`
- `expenseCategories[]` (built-ins + user-created custom ones) — `{id, name, icon}`
- `incomeCategories[]` (fixed built-in set) — `{id, name, icon}`
- `budgets: {categoryId: monthlyLimit}`
- `debts[]` — `{id, person, type: 'owed_to_me'|'i_owe', amount, note, date, settled}`
- `tasks[]` — `{id, title, date, priority: 'low'|'medium'|'high', done}`
- `sharedLoans[]` — `{id, name, totalAmount, startDate, endDate, frequency: 'monthly'|'weekly', participants: [{id, name, share}], order: number[] (participant ids, draw result), payments: {[participantId]: {[periodIndex]: boolean}}}`
- UI-only state: active screen/tab, add-sheet open/type/draft fields, category-filter, analytics period, dark mode flag, notifications flag, lottery animation state.
- All derived numbers (monthly totals, category breakdowns, budget usage %, tip selection, loan payment-progress %) are computed from the above rather than stored — keep them as selectors/computed properties in the real app too.

## Assets
- No image assets — all icons are hand-drawn inline SVG (simple geometric paths), redrawn in `Icon.dc.html` for the category-tile icon set (food, transport, bills, shopping, health, salary, laptop/freelance, gift, generic tag) and inline elsewhere for chrome (nav, back/close/edit/plus, toggles, gear, eye).
- Font: Google Fonts "Cairo" (400/500/600/700/800) — loaded via a standard `<link>`, no self-hosting needed unless required for offline/App Store bundle-size reasons.

## Features Added Since Initial Handoff (read this section first if re-syncing)

### App shell / onboarding flow (new)
Splash screen (auto-advances ~1.7s) → Auth screen (login/signup segmented, email/password fields — no real backend, "الدخول كزائر" guest button bypasses auth) → main app. A "من نحن" (About) screen is reachable from both the auth screen and Settings.

### Freemium paywall (new)
`الميزانية` (Budget), `المهام` (Tasks), and `السلف المشتركة` (Shared Loans) are gated behind a subscription. Tapping any of them (from dashboard tiles, bottom nav, or elsewhere) without `isSubscribed=true` opens a paywall screen (price card, feature bullets, "اشترك الآن" button) instead of navigating. Locked tiles show a small lock badge. Settings has a subscription-status row with an "فعّل الآن" shortcut. This is UI-only — no real payment/store integration.

### Multi-currency (new)
Settings → "العملة" opens a picker sheet listing ~25 currencies (Gulf/Arab region prioritized, plus major world currencies), each with a flag emoji and native-currency symbol. Selecting one instantly reformats every amount in the app. Replace `CURRENCIES` array and the `currency()`/`fmt()` methods with real formatting (Intl.NumberFormat per locale) in production; the flag+name+symbol data structure is a reasonable seed for that.

### Bilingual UI — عربي / English (new, partial coverage)
Settings → "اللغة" segmented control toggles `lang: 'ar'|'en'`, which flips the root container's `dir`/`lang` attributes (rtl↔ltr) and swaps a `STR` dictionary of translated strings (`this.t(key)`). **Coverage is partial**: nav bar, home screen headers/cards, and Settings rows are translated; Analytics, Budget, Tips, Debts, Tasks, and Loans screens still render Arabic-only copy. A production build should replace the inline `STR` object with a proper i18n library and translate the remaining screens.

### Auto-charity / round-up giving (new)
Every income transaction (added via cash, not via "دين" method) accrues a configurable percentage (default 2.5%, editable in Settings → "الصدقة التلقائية" with an on/off toggle) into a running `charityPending` pot. A dashboard card (styled like the tip-of-day card, green/gold palette) shows the pending amount with a "تم الإعطاء ✓" one-tap action that zeroes the pot and logs it to a full "الصدقة" screen (big balance, give button, هالسنة/كل الأوقت filter, history list).

### Live-rates strip (new, mocked)
A pill-shaped bar above the dashboard balance card shows USD (parallel-market rate, Iraq context) and gold (21k) with trend arrows; tapping expands a detail panel (official vs. parallel USD, gold at 18/21/24k, last-updated label). Tapping the refresh icon simulates a fetch (900ms delay, randomized deltas) — **there is no real exchange-rate/gold-price API integration**; wire this to a real FX+commodities data source in production, and implement the offline/stale-data visual state (dimmed figures + "آخر تحديث: أمس") the brief called for.

### Debt-as-payment-method logic (refined)
The add/edit transaction sheet's "دين" (debt) payment-method option now behaves asymmetrically by transaction type:
- **Expense + دين**: records the expense transaction immediately (it already happened) AND creates an "أنا مدين" (I owe) entry on the Debts screen.
- **Income + دين**: does **NOT** create an income transaction or affect the balance yet (money hasn't arrived — e.g. a sale on credit). Instead it creates a "لك" / owed-to-me debt entry carrying the original income category. That entry shows a "تم التحصيل" (collected) button on the Debts screen; tapping it creates the real income transaction (dated at the moment of collection, using the stored category) and marks the debt settled/struck-through. "أنا مدين" entries keep the original simple settle/unsettle toggle.
- The add-sheet's note-field placeholder text now switches with the Expense/Income segmented control ("مثال: غداء عمل" vs. "مثال: راتب شهر آب").

### Shared/group loans (السلف المشتركة) — new feature, not in the original handoff
See the **Screens / Views → 8. السلف المشتركة** section below (already documents create flow, payout-order lottery, and the per-person-per-period payment grid) — this whole feature was added after the first handoff and needs full implementation.

## Updates Since Previous Sync (read this first — supersedes some details above)

- **Balance calculation bugfix (important):** "الرصيد المتاح" is now `totalBalance()` = sum of every account's balance (`accountBalance(id)`, which includes ALL transactions for that account, no exclusions). Previously it wrongly used `income - expense` computed from a filtered set that excluded loans/transfers, so taking a loan didn't move the displayed balance even though it moved real cash. Keep this separation: **balance/account math must never filter out `isTransfer`**, only the monthly income/expense analytics cards and category breakdowns should exclude `isTransfer` rows (loans, internal transfers) since those aren't earned/spent money.
- **Loans as a debts-linked income/expense type:** giving a loan ("أطلب" in Debts) now creates a real expense transaction (categoryId `loan_given`) that deducts from the chosen account immediately, blocked if insufficient balance. Receiving a loan is done via the Add Transaction sheet: Income tab → payment method "دين" — this now creates a real income transaction (categoryId `loan`, a new income category) that credits the chosen account, AND logs a "مطلوب" (owed-by-me) entry in the Debts screen (previously this was backwards — it incorrectly logged as "owed to me"). Both loan transaction types carry `isTransfer: true` so they're excluded from income/expense analytics but still count toward account balances.
- **Account transfers**: Settings → "تحويل بين الحسابات" opens a dialog to move money between cash/card (or any configured account), with a currency selector and optional note, direction-swap button, and insufficient-balance validation. Produces two linked transactions (`isTransfer: true`).
- **Debts screen renamed**: "يطلبني"/"أنا مدين" → **"أطلب"** / **"مطلوب"**. Both support partial settlement (progress bar + partial-amount input + a "settle all" button), each partial/full settlement creating a real linked transaction.
- Per-transaction currency display: transaction rows now render in the currency they were actually recorded in (`fmtTx()`), not force-converted to the base currency — only aggregates (totals, analytics, budget) convert via `txBase()`.
- See the previous sync notes below for everything else (paywall removal, real-money savings goals, budget forecast cards, analytics summary screen, all-transactions screen, auto-generated financial tasks, shared-loan invite status, backup export/import, Iraqi Dinar default with country flags, Gregorian month naming, multi-account/multi-currency support, period-close/rollover in حسابي).

## Files
- `app.dc.html` — the full interactive prototype (all screens + all modals). This is the primary reference; view it in a browser to click through every flow.
- `Icon.dc.html` — the reusable colorful category-icon tile component (icon key → duotone color pair + filled glyph), referenced by `app.dc.html`.

## Updates Since Previous Sync (read this first — supersedes some details above)

- **App renamed to "دفتر"** (was "محفظتي") — splash, auth screen, About screen, and backup filename all reflect this.
- **Freemium paywall removed entirely.** All screens (Budget, Tasks, Shared Loans, Installments, Goals) are free and directly reachable — no lock badges, no subscription/paywall screen, no "فعّل الآن" row in Settings. Ignore the "Freemium paywall (new)" section above; it no longer applies.
- **Debts screen renamed/reworked**: "يطلبني" → **"أطلب"**. Both "أطلب" (owed to me) and "أنا مدين" (I owe) now support **partial repayment**: a progress bar (paid/total) plus an amount field + "سجل تحصيل"/"سجل دفعة" button that logs a partial real transaction (income for أطلب, expense for أنا مدين), and a "تحصيل الكل"/"شطب" button that settles the remaining balance in one real transaction. Collecting on "أطلب" also runs the auto-charity calculation.
- **Savings goals (القاصة) now move real money**: contributing deducts a real expense transaction (money actually leaves balance, unlike the charity pot which is tracking-only); reaching a goal shows "تم الشراء ✓" which converts the saved pot into a real purchase expense and closes the goal; "سحب الرصيد" withdraws the saved amount back as a real income transaction.
- **Budget screen ("الميزانية") gained two forecast cards** at the top: (1) "صافي متوقع بعد كل الالتزامات" — net forecast combining current income/expense with upcoming upfront-commitment shares, pending debts owed, and expected inflows from debts/installments; (2) a conditional "توصية توفير" card computing the monthly amount needed to hit the nearest dated savings goal.
- **Analytics screen gained a "الصورة المالية الشاملة" section**: clickable summary tiles surfacing net worth, savings total, أطلب/أنا مدين totals, customer-installment amounts due/overdue, pending charity, and today's task completion — each tile deep-links to its source screen.
- **New "كل العمليات" (all transactions) screen**, reached via "عرض الكل" on the dashboard — a full scrollable history of every transaction (not just the last 6), each row with icon, category+date, amount, and a pencil button opening that transaction in the edit sheet.
- **Tasks screen now merges manual tasks with auto-generated financial tasks** sourced from upcoming/overdue upfront-commitment periods, customer-installment due dates, unsettled "أنا مدين" debts, and active savings-goal monthly targets (each tagged with a small source emoji). Completing a manual/keyword-financial task opens a quick-log dialog that creates the expense in one tap; completing an auto-generated task from installments/debts/goals navigates straight to that source screen's action instead of just checking a box.
- **Shared-loan participants now carry a phone field and invite status** (`pending`/`accepted`/`declined`) shown as a small badge in the payment grid — participants added with a phone start "pending" and the prototype simulates auto-acceptance a few seconds later (standing in for real OTP-verification-linked invites); participants added without a phone are auto-accepted (organizer-only entry).
- **Data export/import**: Settings gained "تصدير نسخة احتياطية" (downloads full app state as JSON) and "استيراد" (restores from a JSON file) — a stopgap for data-loss protection ahead of any real backend/sync.
- **Currency defaults to Iraqi Dinar (د.ع)** with an expanded currency picker covering all Arab-league countries (plus major world currencies), each row showing a country flag instead of a 3-letter code.
- **Calendar copy uses the Gregorian month names in their Arabic-Iraqi/Levantine form** (كانون الثاني، شباط، آذار، نيسان، أيار، حزيران، تموز، آب، أيلول، تشرين الأول، تشرين الثاني، كانون الأول) everywhere a date is displayed, via a shared `dateWithMonth()` helper — not the Gulf-style transliterated names (يناير، فبراير…) used elsewhere in the app's older code comments.
- **Add/edit transaction sheet bugfixes**: category-select and payment-method segmented controls previously used inline arrow-function expressions inside style/onClick holes that silently failed to bind in the template engine — all such bindings were replaced with named handlers from `renderVals()`. If continuing to extend this screen, follow that pattern (no inline `() => ...` inside a `{{ }}` hole) to avoid the same class of bug.

### New data model additions to account for (not covered in the original State Management section)
- `debts[]` items gained: `paidSoFar` (number), `payments: [{date, amount, linkedTransactionId}]` — both debt directions now track partial history, not just a boolean `settled`.
- `savingsGoals[]` — `{id, name, targetAmount, currentSaved, targetDate?, status: 'active'|'achieved', contributions: [{date, amount}]}`.
- `upfrontExpenses[]` — `{id, title, totalAmount, periodsCount, periodAmount, startDate, categoryId, periods: [{index, monthLabel, amount, dueDate}]}` (one real expense transaction recorded at creation; periods are display-only, used for budget-share forecasting and auto-task generation).
- `installmentPlans[]` (customer installments a shop-owner tracks) — `{id, customerName, customerPhone?, itemDescription?, totalAmount, periodsCount, periodAmount, startDate, periods: [{index, dueDate, monthLabel, amount, status:'pending'|'paid', paidDate?, linkedTransactionId?}], status:'active'|'completed'}`.
- `charityPending` (number) + `charityLog[]` — `{id, date, amount, note?}` for the auto-charity feature.
- `sharedLoans[].participants[]` items gained: `phone`, `inviteStatus: 'pending'|'accepted'|'declined'`.
- `tasks[]` items can carry `source: 'commitment'|'installment'|'debt'|'goal'` and `linkedEntityId` when auto-generated (see `collectAutoTasks()`/`allTasksMerged()` in `app.dc.html` for the exact derivation logic to port).
