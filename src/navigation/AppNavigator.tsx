import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const RootStack = createNativeStackNavigator({
    screens: {
        Home: HomeScreen,
    },
});

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
    interface RootNavigator extends RootStackType {}
}

const Navigation = createStaticNavigation(RootStack);

const AppNavigator = () => {
    return <Navigation />;
};

export default AppNavigator;
