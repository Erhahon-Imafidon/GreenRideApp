/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Must be registered outside the component tree.
// Fires when a message arrives while the app is backgrounded or killed.
messaging().setBackgroundMessageHandler(async () => {
    // Logging only — navigation happens when the user *taps* the notification,
    // which is handled by onNotificationOpenedApp / getInitialNotification.
});

AppRegistry.registerComponent(appName, () => App);
