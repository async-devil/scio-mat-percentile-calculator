# Website template

This website template is build for projects based on webpack, typescript and scss.

## Features

- Configured webpack
- Auto-deploy on every push to github pages (if not needed, delete `.github/workflows/pages.yml` file)
- Configured eslint and prettier

Do not forget to enable github pages in the settings of your repository.

## Commands

### Installation

```bash
yarn install
```

### Start development server

```bash
yarn start:dev
```

Default port is: `8080`. You can change that in the `webpack.config.cjs` file.

### Production build

```bash
yarn build
```
