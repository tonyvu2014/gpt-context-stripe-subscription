module.exports = {
    env: {
        es6: true,
        node: true
    },
    parserOptions: {
        "ecmaVersion": 2018
    },
    extends: [
        "eslint:recommended",
        "google"
    ],
    rules: {
        "indent": ["error", 4],
        "object-curly-spacing": ["error", "always"],
        "comma-dangle": ["error", "never"],
        "no-restricted-globals": ["error", "name", "length"],
        "prefer-arrow-callback": "error",
        "quotes": ["off", { "allowTemplateLiterals": true }]
    },
    overrides: [
        {
            files: ["**/*.spec.*"],
            env: {
                mocha: true
            },
            rules: {}
        }
    ],
    globals: {}
};
