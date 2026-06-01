# 🌱 GreenRide

GreenRide is an eco-friendly ride-hailing mobile app built with **React Native**. It lets users find nearby low-emission rides (Electric / Hybrid), see the **CO₂ they save** by choosing greener transport, earn **EcoPoints**, and track their environmental impact over time.

The app runs on both **Android and iOS**, written in **TypeScript** throughout, and targets **React 19 / React Native 0.85**.

---

## ✨ Features

- **Map-based home screen** — Google Maps with the user's live location and a destination marker.
- **Destination search** — type where you're going; the app geocodes the address and drops a pin on the map. Shows inline feedback when an address can't be found.
- **Ride listing** — fetches available rides from a mock API, with automatic fallback to bundled mock data if the server is unreachable.
- **Booking flow** — confirm a ride on a dedicated CO₂ "hero" screen, then a success screen with an EcoPoints summary.
- **Profile & gamification** — lifetime stats, EcoPoints, achievement badges, and ride history.
- **Light / dark theme** — toggle in the Profile screen; propagates app-wide via design tokens.

---

## 🧱 Tech Stack

| Concern | Choice |
|---|---|
| Framework | React Native 0.85 (`@react-native-community/cli`) |
| Language | TypeScript, React 19 |
| Navigation | React Navigation 7 (static API) — native stack + bottom tabs |
| State | Redux Toolkit + typed hooks |
| Styling | `@mgcrea/react-native-tailwind` (`className` props) |
| Maps | `react-native-maps` (Google provider) |
| HTTP | `axios` |
| Config / secrets | `react-native-config` (`.env`) |
| Mock backend | `json-server` |
| Testing | Jest + `@testing-library/react-native` |

---

## 📐 Architecture

### Entry & providers
`index.js` → `App.tsx` → `<Provider store={store}>` → `<SafeAreaProvider>` → `<AppNavigator />`. All global providers live in `App.tsx`.

### Navigation
Defined in `src/navigation/AppNavigator.tsx` using React Navigation's **static API**:

- **RootStack** — `Splash` → `Main`
- **MainTabs** (bottom tabs) — `Home`, `Profile`
- **HomeStack** (nested in Home tab) — `HomeMain` → `ConfirmRide` → `BookingSuccess`

Add a new screen by registering it in the relevant `screens` map in `AppNavigator.tsx`.

### State management
Redux Toolkit store in `src/store/index.ts` with four slices:

| Slice | Holds |
|---|---|
| `ridesSlice` | `rides[]`, `selectedRide`, `loading`, `error` |
| `bookingSlice` | `origin`, `destination`, `status` |
| `profileSlice` | `totalRides`, `totalCo2Saved`, `ecoPoints`, `rideHistory[]` |
| `themeSlice` | `mode: 'light' \| 'dark'` |

Always use the typed hooks from `src/hooks/reduxHook.ts` — `useAppDispatch` / `useAppSelector`.

**Key decisions:**
- Slices hold **local UI state only** — reducers are pure, no side effects.
- **API calls** live in `src/api/` services and are dispatched from screens.
- The **theme side effect** (`Appearance.setColorScheme`) runs in a Redux listener middleware, not in a reducer.
- **EcoPoints formula:** `Math.round(co2Saved * 10)` points per completed ride.

### Styling / theming
- Use `className` (Tailwind-style) for layout and styling — not `StyleSheet.create`.
- All screens use the `scheme:` prefix for light/dark tokens, e.g. `scheme:bg-background`, `scheme:text-textPrimary`.
- Color tokens are defined in `tailwind.config.ts`.
- Raw hex values (for `LinearGradient` and non-`className` usage) live in `src/constants/colors.ts`.

---

## 📁 Project Structure

```
src/
├── api/
│   ├── axiosInstance.ts      # axios instance — base URL http://10.0.2.2:3001
│   └── ridesService.ts       # getRides(), getRideById(id)
├── components/
│   ├── common/               # GradientButton, ScreenHeader, StatusBadge
│   ├── confirmation/         # Co2HeroCard, RideDetailRow
│   ├── home/                 # RideCard, RideList
│   ├── map/                  # RideMap
│   └── profile/              # StatCard, EcoPointsCard, AchievementBadge
├── constants/
│   ├── colors.ts             # Raw hex values for LinearGradient / JS usage
│   └── maps.ts               # MAPS_API_KEY (loaded from .env, gitignored)
├── hooks/
│   └── reduxHook.ts          # useAppDispatch, useAppSelector
├── navigation/
│   └── AppNavigator.tsx      # Root stack + tabs + Home stack
├── screens/
│   ├── SplashScreen.tsx      # 2s auto-advance to Main
│   ├── HomeScreen.tsx        # Map + destination search + ride list
│   ├── ConfirmRideScreen.tsx # CO₂ hero card, detail rows, confirm CTA
│   ├── BookingSuccessScreen.tsx # Animated success, EcoPoints summary
│   └── ProfileScreen.tsx     # Stats, EcoPoints, achievements, theme toggle
├── store/
│   ├── index.ts              # configureStore — four slices + theme listener
│   └── slices/               # ridesSlice, bookingSlice, profileSlice, themeSlice
└── types/
    └── index.ts              # Ride, BookingStatus, RideHistoryItem

server/
├── db.json                   # json-server mock data (rides, bookings)
└── routes.json               # /api/rides → /rides aliases

__tests__/                    # App.test.tsx
src/__tests__/                # components/RideCard.test.tsx, store/profileSlice.test.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node >= 22.11.0**
- **Android:** JDK + Android SDK / Android Studio with an emulator or a connected device
- **iOS (macOS only):** Xcode + Xcode Command Line Tools, plus **CocoaPods** and a Ruby version that satisfies the project's `Gemfile`
- React Native dev environment set up — see the [official guide](https://reactnative.dev/docs/set-up-your-environment)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root (this file is **gitignored** — never commit it):

```bash
MAPS_API_KEY=your_google_maps_api_key_here
```

This key is loaded via `react-native-config` and consumed in `src/constants/maps.ts`.

### 3. Configure the native Google Maps key
The **map rendering** (Maps SDK) reads its key natively on each platform.

**Android** — `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ACTUAL_KEY_HERE"/>
```

**iOS** — provide the key to the Maps SDK in `ios/GreenRideApp/AppDelegate.swift` (e.g. `GMSServices.provideAPIKey("YOUR_ACTUAL_KEY_HERE")`).

> **Required Google Cloud APIs:** Maps SDK for Android, Maps SDK for iOS, Geocoding API.
> **Security:** restrict the key in Google Cloud Console — by Android package name + SHA‑1 fingerprint, by iOS bundle ID, and to only the APIs you use.

### 4. Start the mock API server
The ride list is served by `json-server` on port **3001**. The app reaches it via `http://10.0.2.2:3001` (the Android emulator's alias for your machine's `localhost`).

```bash
npm run server
```

> If the server is unreachable, HomeScreen falls back to bundled `MOCK_RIDES`, so the app still runs.

### 5. Start Metro and run the app
Start the Metro bundler first, in its own terminal:

```bash
npm start
```

#### Run on Android
With Metro running, in a second terminal:

```bash
npm run android
```

This builds the app and launches it on a running emulator or a connected device.

#### Run on iOS (macOS only)
iOS uses CocoaPods for its native dependencies. **The first time**, and after any native dependency change, install the pods:

```bash
# Install Ruby gems (CocoaPods) — first time only
bundle install

# Install / update CocoaPods dependencies
cd ios && bundle exec pod install && cd ..
```

Then build and launch on the iOS Simulator:

```bash
npm run ios
```

To target a specific simulator:

```bash
npm run ios -- --simulator="iPhone 15 Pro"
```

**Running from Xcode instead:** open the generated workspace and press **Run (⌘R)**:

```bash
open ios/GreenRideApp.xcworkspace
```

> Always open the `.xcworkspace` file (created by `pod install`), **not** the `.xcodeproj`. Select a simulator from the scheme dropdown, then run.

---

## 🧪 Testing

Tests use **Jest** with the React Native preset and **@testing-library/react-native**. Test files live in `__tests__/` and `src/__tests__/`.

```bash
# Run the full test suite
npm test

# Run a single test file
npx jest src/__tests__/store/profileSlice.test.ts

# Run tests matching a name pattern
npx jest -t "RideCard"

# Watch mode
npx jest --watch

# With coverage report (output in /coverage)
npx jest --coverage
```

Current tests:
- `__tests__/App.test.tsx` — app renders
- `src/__tests__/components/RideCard.test.tsx` — ride card component
- `src/__tests__/store/profileSlice.test.ts` — profile slice reducer logic

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Metro bundler |
| `npm run android` | Build and run on Android emulator / device |
| `npm run ios` | Build and run on iOS simulator (macOS) |
| `npm run server` | Start the json-server mock API on port 3001 |
| `npm test` | Run the Jest test suite |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format the codebase with Prettier |

---

## 🔐 Security Notes

- `src/constants/maps.ts` and `.env` are **gitignored** — API keys must not be committed.
- An API key shipped in a mobile app is extractable from the built APK; the **real protection** is Google Cloud Console key restriction (package name + SHA‑1 + minimal API scope), not where the key is stored in source.
- Rotate any key that has previously been committed or shared.

---

## 🛠️ Troubleshooting

| Issue | Fix |
|---|---|
| Map is blank / grey | Check the `AndroidManifest.xml` key and that **Maps SDK for Android** is enabled. |
| Destination search does nothing | Ensure the **Geocoding API** is enabled and `MAPS_API_KEY` is set in `.env`; rebuild the app after changing `.env`. |
| Rides always show mock data | The json-server isn't running or isn't reachable — start it with `npm run server`. |
| `Config.MAPS_API_KEY` is undefined | `.env` changes require a **full native rebuild** (`npm run android` / `npm run ios`), not just a Metro reload. |
| iOS build fails on missing pods | Run `bundle exec pod install` inside `ios/`, then rebuild. After upgrading native deps, delete `ios/Pods` and reinstall. |
| Metro cache issues | Restart with `npm start -- --reset-cache`. |
