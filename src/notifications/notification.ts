import { PermissionsAndroid, Platform } from 'react-native';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigate } from '../navigation/navigationRef';

// -----------------------------------------------------------------
// Types
// -----------------------------------------------------------------

type NotificationData = Record<string, string>;

// -----------------------------------------------------------------
// Permission
// -----------------------------------------------------------------

export async function requestUserPermission(): Promise<void> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
    }
    await messaging().requestPermission();
}

// -----------------------------------------------------------------
// FCM token
// -----------------------------------------------------------------

export async function getFcmToken(): Promise<string> {
    const token = await messaging().getToken();
    // if (__DEV__) {
    //     console.log('[GreenRide] FCM TOKEN:', token);
    // }
    console.log('[GreenRide] FCM TOKEN:', token);
    return token;
}

// -----------------------------------------------------------------
// Android notification channel (required on Android 8+)
// -----------------------------------------------------------------

export async function createChannel(): Promise<void> {
    await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
}

// -----------------------------------------------------------------
// Routing — maps FCM data payload → screen navigation
//
// Send these key/value pairs from the Firebase Console under
// "Additional options → Custom data" to drive deep-linking:
//
//   screen = "Profile"          → opens Profile tab
//   screen = "HomeMain"         → opens the Home screen
//   screen = "BookingSuccess"   → opens booking success screen
//
// Values are always strings when they come from FCM.
// -----------------------------------------------------------------

export function routeFromData(data?: NotificationData): void {
    if (!data?.screen) return;
    const { screen, ...params } = data;
    navigate(screen, Object.keys(params).length > 0 ? params : undefined);
}

// -----------------------------------------------------------------
// Foreground message handler
// FCM does NOT display a notification UI when the app is open —
// we use notifee to show one ourselves.
// Returns an unsubscribe function to call on component unmount.
// -----------------------------------------------------------------

export function setupForegroundHandler(): () => void {
    return messaging().onMessage(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            await notifee.displayNotification({
                title: remoteMessage.notification?.title ?? 'GreenRide',
                body: remoteMessage.notification?.body ?? '',
                data: remoteMessage.data as NotificationData,
                android: {
                    channelId: 'default',
                    pressAction: { id: 'default' },
                    smallIcon: 'ic_launcher',
                },
            });
        }
    );
}

// -----------------------------------------------------------------
// Notifee foreground tap handler
// Fires when the user taps a notifee-displayed notification while
// the app is in the foreground.
// Returns an unsubscribe function to call on component unmount.
// -----------------------------------------------------------------

export function setupNotifeeTapHandler(): () => void {
    return notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            routeFromData(detail.notification?.data as NotificationData);
        }
    });
}
