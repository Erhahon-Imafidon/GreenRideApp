module.exports = {
    preset: '@react-native/jest-preset',
    moduleNameMapper: {
        'react-native-linear-gradient':
            '<rootDir>/src/__mocks__/react-native-linear-gradient.tsx',
    },
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@mgcrea/react-native-tailwind|@reduxjs/toolkit|immer|redux)/)',
    ],
};
