import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(
    screen: string,
    params?: Record<string, unknown>
): void {
    if (!navigationRef.isReady()) {
        setTimeout(() => navigate(screen, params), 300);
        return;
    }

    // Nested screens (Profile, HomeMain, etc.) live inside Main → MainTabs,
    // which isn't rendered until Splash resets to Main (after its 2 s timer).
    // Attempting navigate() before that produces a "not handled" error because
    // the tab navigator subtree doesn't exist yet.  Keep retrying until we're
    // past Splash.
    if (navigationRef.getCurrentRoute()?.name === 'Splash') {
        setTimeout(() => navigate(screen, params), 300);
        return;
    }

    // @ts-ignore — static-API types don't expose navigate() on the ref
    // but it works at runtime; see RN docs on navigation ref usage
    navigationRef.navigate(screen, params);
}
