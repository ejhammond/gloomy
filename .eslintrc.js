module.exports = {
  extends: [
    "plugin:@tripphamm/eslint-plugin/react",
    "plugin:@tripphamm/eslint-plugin/node",
  ],
  rules: {
    "no-case-declarations": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
  },
}
