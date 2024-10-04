# Dubco - URL Shortener CLI

A command line tool for easily shortening URLs using the dub.co service. ✂️

## Quick Demo

https://github.com/user-attachments/assets/96f60f50-f7c7-456c-a805-345ac27a06d4

> **Warning**
> Demo video uses 'dub', but you need to use 'dubco'.
>
> If the cli does not work as expected, you can try to run `dubco login` again to refresh your credentials.

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

### Login

You need to run the `login` command with your `Workspace API Key`:

```bash
dubco login [token]
```

#### Example

```bash
dubco login dub_Nlaw9TUaeSkGfRii3lmgZLid
```

### Config

To view your current dubco configuration, you can run the `config` command:

```bash
dubco config
```

### link

To create a new short link, you can run the `shorten` command:

```bash
dubco link [url] [shortkey]
```

This command will take a `url` and an optional `shortkey` as arguments and shorten the url using the dub.co API.

#### Example

```bash
dubco link https://example.com/jhondoe/data jhon
```

If you provide a `url` but not a `shortkey`, it will generate a random shortkey using `nanoid`.

If you do not provide any arguments, it will prompt you to enter a `destination url` and an optional `shortkey`.

## Credits

Dubco CLI uses the [dub.co](https://dub.co) API to make short links.
Visit https://dub.co to manage your links in more advanced ways.
