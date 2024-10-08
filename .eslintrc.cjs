module.exports = {
  "ignorePatterns": [".eslintrc.cjs", "postcss.config.js", "remix.config.js"],
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": ["standard-with-typescript", "plugin:prettier/recommended"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}
