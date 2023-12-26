# Dubco - URL Shortener CLI
A command line tool for easily shortening URLs using the dub.co service. ✂️

## Quick Demo 
https://github.com/sujjeee/dubco/assets/101963203/5f1f519e-0728-4697-9dfb-4ba042d8937d

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

You need to run the `login` command with your `API token`:

```bash
dubco login [token]
```

#### Example

```bash
dubco login Nlaw9TUaeSkGfRii3lmgZLid
```

This command will authenticate your API token and fetch your credentials and project details from `dub.co`. It will then save them in a `dubco.json` file on your machine.

If the cli does not work as expected, you can try to run `dubco login` again to refresh your credentials.

### Config

To view your current dubco configuration, you can run the `config` command:

```bash
dubco config
```

This will show you the contents of the `dubco.json` file on your machine.

To change your dubco configuration, you can run the `config set` command:

```bash
dubco config set
```

This command will ask you to choose what you want to update: `project or domain`.

If you select `project` it will display all your projects and prompt you to choose one. After selection, it will update the `slug` value within the `project` object in the dubco config file according to your choice.

If you choose `domain` it will perform the same action for the `Domain` object.

### Shorten

To create a new short link, you can run the `shorten` command:

```bash
dubco shorten [url] [shortkey]
```

This command will take a `url` and an optional `shortkey` as arguments and shorten the url using the dub.co API.

#### Example

```bash
dubco shorten https://example.com/jhondoe/data jhon
```

If you provide a `url` but not a `shortkey`, it will generate a random shortkey using `nanoid`.

If you do not provide any arguments, it will prompt you to enter a `destination url` and an optional `shortkey`.

### Create
If you don’t have any project on your dub account, you will see an error when you try to run any command. You need to create a project first on dub.co before you can use the CLI.

Alternatively, you can use the `create project` command to create a new project from the CLI:

```bash
dubco create project
```

This will prompt you to enter details for a new project:

- **Project Name**: Descriptive name for your project
- **Project Slug**: Unique slug used in the project URL
- **Project Domain**: Verified domain name you own

Make sure you enter a domain that is unique and unused elsewhere. 

After creating the project, you can start shortening URLs. However, you need to verify domain ownership first on [dub.co](https://dub.co) before using it, otherwise you will see a warning that the domain is not verified.

#### Recommanded
For more flexibility in project creation, it is recommended to create projects directly from the [dub.co](https://dub.co) dashboard when possible. The website provides additional guidance and suggestions to create a project.

## Credits

Dubco CLI uses the [dub.co](https://dub.co) API to make short links.
Visit https://dub.co to manage your links in more advanced ways.
