# Dubco - URL Shortener CLI
A command line tool for easily shortening URLs using the dub.co service. ✂️

## Installation
Install dubco globally to access the commands from your terminal:
```bash
npm install -g dubco
```
or if you are using pnpm 

```bash
pnpm install -g dubco
```

## Usage

### Initialize Config

Run the `init` command to create a dubco config file:

```bash
dubco init
```

This will ask you to enter your `dub.co` authorization `token`, `domain` and `project slug` which are needed for making short links and save them in a `dubco.config.json` file on your machine.

You can run the `init` command again later if you want to update the credentials.

### Create ShortLink

Run the `create` commandd to create a new short link:

```bash
dubco create
```

This will prompt you to enter the `destination url` and an optional `shortkey`. It will then use the `dub.co api` to make a short link.

### Show Config

Run the `Config` command to view the current dubco config:

```bash
dubco Config
```

this will retrieve the current config file form your machine and show to you.

## Credits

dubco cli uses the [dub.co](https://dub.co) API to make short links.

Visit https://dub.co to manage your links in more advanced ways.
