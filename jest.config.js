module.exports = {
    preset: '@react-native/jest-preset',
    moduleNameMapper: {
        'react-native-linear-gradient':
            '<rootDir>/src/__mocks__/react-native-linear-gradient.tsx',
        'react-native-permissions':
            '<rootDir>/src/__mocks__/react-native-permissions.ts',
    },
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@mgcrea/react-native-tailwind|@reduxjs/toolkit|immer|redux|@react-navigation)/)',
    ],
};
