## Getting set up

These steps are written for a Mac.

You'll be typing commands into an app called **Terminal**. Terminal lets you control your computer by typing instead of clicking. It looks a bit plain, but you only need a handful of commands, and each one is explained as you go.

**To open Terminal:** press **Command + Space**, type `Terminal`, then press **Return**.

**How to use the commands in these steps:**

- Copy each command exactly as it's shown, paste it into Terminal, then press **Return**.
- Do one command at a time, and wait for it to finish before typing the next one. You'll know it's finished when you see a blinking cursor at the start of a new line.
- If you see words like **warn** or **deprecated** in the output, don't worry. These are normal and you can ignore them.

### 1. Check you have Node.js

Node.js is a program that lets your computer run JavaScript outside a web browser. The accessibility tools in these steps are written in JavaScript, so they need Node.js to work.

Type:

```bash
node -v
```

(The `-v` is short for "version".)

You should see a version number that starts with the letter `v`, like `v22.12.0`.

**What the number means:** the first number is the main version. You need **version 22.12 or higher**, because older versions are missing features these tools rely on.

- `v22.12.0`, or anything starting with `v23`, `v24` or higher: you're good to go.
- `v20...`, `v18...` or anything lower: too old, so follow the steps below.

**If you see "command not found", or your version is too old:**

1. Go to [nodejs.org](https://nodejs.org).
2. Download the version marked **LTS**, which stands for "Long Term Support". It's the stable version most people should use.
3. Open the file you downloaded and follow the steps in the installer. Your Mac may ask for your password. That's normal.
4. Quit Terminal completely (**Command + Q**), then open it again.
5. Type `node -v` again to check it worked.

### 2. Check you have npm

npm stands for "Node Package Manager". It downloads and installs extra software, called **packages**, that other people have written. You'll use it to install the accessibility tools.

npm comes with Node.js, so if you have Node.js, you have npm too.

Type:

```bash
npm -v
```

You should see a version number, such as `10.9.2`. Any number means npm is working.

**If you see "command not found":** install (or reinstall) Node.js using the steps above. npm comes with it.

### 3. Check you have Google Chrome

The accessibility tool opens Google Chrome behind the scenes to check your pages, so you need Chrome installed.

If you don't have it, download it from [google.com/chrome](https://www.google.com/chrome).

### 4. Create a project folder

You'll keep everything for these steps in one folder. Type these commands one at a time:

```bash
cd Documents
```

`cd` stands for "change directory". (Directory is another word for folder.) This moves you into your Documents folder.

```bash
mkdir axe-learning
```

`mkdir` stands for "make directory". This creates a new folder called `axe-learning` inside Documents.

```bash
cd axe-learning
```

This moves you into the new folder.

**To check it worked, type:**

```bash
pwd
```

`pwd` stands for "print working directory", which is a fancy way of saying "show me where I am". You should see something ending in `/Documents/axe-learning`.

**Important:** from now on, every command should be typed while you're inside this folder. If you quit Terminal and come back later, you'll need to move back into the folder first. Type `cd Documents/axe-learning` and press Return.

### 5. Turn the folder into a project

Type:

```bash
npm init -y
```

This turns your folder into a project, which means npm can install tools into it. The `-y` stands for "yes", and accepts all the default settings for you, so you won't be asked any questions.

You'll see some text appear on screen. That's npm showing you what it created, a file called `package.json`. Think of this file as the project's notebook: it keeps a list of the tools you install.

**To check it worked, type:**

```bash
ls
```

`ls` stands for "list", and shows the files in your folder. You should see `package.json`.

### 6. Install the accessibility tools

Type:

```bash
npm install @axe-core/cli playwright @axe-core/playwright
```

This installs three tools in one go. It may take a minute.

- **`@axe-core/cli`** checks a web page for accessibility problems when you type one command. "CLI" stands for "command line interface", which just means a tool you use by typing commands rather than clicking buttons.
- **`playwright`** controls a web browser automatically. It can open pages, click buttons and fill in forms, just like a person would.
- **`@axe-core/playwright`** lets the accessibility checker run while Playwright is in control of the browser. This is useful for pages that need you to log in or click through steps before you check them.

You'll notice a new folder called `node_modules` appears in your project folder. That's where npm stores the tools it installed. You never need to open it or change anything in it.

**To check it worked, type:**

```bash
npm ls
```

You should see the three tools listed, each with a version number.

### 7. Download Playwright's browser

Playwright uses its own copy of a browser, separate from the Chrome you normally use. Type:

```bash
npx playwright install chromium
```

Chromium is the free, open-source browser that Google Chrome is built on. This download may take a minute or two.

### 8. Run your first check

Type:

```bash
npx axe https://example.com
```

`npx` comes with npm. It runs a tool you've installed in your project. Here it runs axe, which:

1. opens the page in an invisible copy of Chrome
2. checks it for common accessibility problems
3. lists any problems it finds.

It can take a few seconds, so be patient. When it's done, you'll see a list of any problems it found, followed by a line saying how many it found in total.

To check a different page, replace `https://example.com` with that page's address.

**If you see an error mentioning "chromedriver" or "session not created":** this means the version of Chrome on your computer and the version the tool expects don't match. Type this to fix it, then try again:

```bash
npx browser-driver-manager install chrome
```
