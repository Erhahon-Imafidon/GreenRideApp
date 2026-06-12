import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(
    screen: string,
    params?: Record<string, unknown>
): void {
    if (navigationRef.isReady()) {
        // @ts-ignore — static-API types don't expose navigate() on the ref
        // but it works at runtime; see RN docs on navigation ref usage
        navigationRef.navigate(screen, params);
    } else {
        // Navigator hasn't mounted yet (cold start from a killed state).
        // Retry once the JS thread has had a chance to render it.
        setTimeout(() => navigate(screen, params), 300);
    }
}
