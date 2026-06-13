import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import {
    requestUserPermission,
    getFcmToken,
    createChannel,
    setupForegroundHandler,
    setupNotifeeTapHandler,
    routeFromData,
} from '../notifications/notification';

export function useNotificationSetup(): void {
    useEffect(() => {
        (async () => {
            try {
                await requestUserPermission();
                await createChannel();
                await getFcmToken();
            } catch (e) {
                if (__DEV__) {
                    crashlytics().recordError(e as Error);
                    console.warn('[GreenRide] Notification setup failed:', e);
                }
            }
        })();

        const unsubForeground = setupForegroundHandler();
        const unsubTap = setupNotifeeTapHandler();

        // App was minimised (background) and user tapped the notification
        const unsubOpened = messaging().onNotificationOpenedApp(
            (remoteMessage) => {
                routeFromData(
                    remoteMessage.data as Record<string, string> | undefined
                );
            }
        );

        // App was killed and user tapped the notification to cold-start it
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    routeFromData(
                        remoteMessage.data as Record<string, string> | undefined
                    );
                }
            });

        return () => {
            unsubForeground();
            unsubTap();
            unsubOpened();
        };
    }, []);
}
