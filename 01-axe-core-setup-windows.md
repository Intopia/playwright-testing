## Getting set up

These steps are written for Windows.

You'll be typing commands into an app called **Command Prompt**. Command Prompt lets you control your computer by typing instead of clicking. It looks a bit plain, but you only need a handful of commands, and each one is explained as you go.

**Use Command Prompt, not PowerShell.** Windows also has an app called PowerShell that looks similar. PowerShell often blocks the tools in these steps with an error saying "running scripts is disabled on this system". Command Prompt doesn't have that problem.

**To open Command Prompt:** press the **Windows key**, type `Command Prompt`, then press **Enter**.

**To check you're in the right app:** the line where you type should start with something like `C:\Users\yourname>`. If it starts with `PS`, like `PS C:\Users\yourname>`, you're in PowerShell. Close it and open Command Prompt instead.

**How to use the commands in these steps:**

- Copy each command exactly as it's shown, paste it into Command Prompt, then press **Enter**. To paste, press **Ctrl + V** or right-click inside the window.
- Do one command at a time, and wait for it to finish before typing the next one. You'll know it's finished when you see the `C:\...>` line again, with a blinking cursor after it.
- If you see words like **warn** or **deprecated** in the output, don't worry. These are normal and you can ignore them.

### 1. Check you have Node.js

Node.js is a program that lets your computer run JavaScript outside a web browser. The accessibility tools in these steps are written in JavaScript, so they need Node.js to work.

Type:

```bat
node -v
```

(The `-v` is short for "version".)

You should see a version number that starts with the letter `v`, like `v22.12.0`.

**What the number means:** the first number is the main version. You need **version 22.12 or higher**, because older versions are missing features these tools rely on.

- `v22.12.0`, or anything starting with `v23`, `v24` or higher: you're good to go.
- `v20...`, `v18...` or anything lower: too old, so follow the steps below.

**If you see "'node' is not recognized as an internal or external command", or your version is too old:**

1. Go to [nodejs.org](https://nodejs.org).
2. Download the version marked **LTS**, which stands for "Long Term Support". It's the stable version most people should use. Choose the **Windows Installer (.msi)**.
3. Open the file you downloaded and follow the steps in the installer. You can accept the default settings on each screen, with one exception:
   - When you reach a screen called **Tools for Native Modules**, leave the box **unticked**. Ticking it installs a lot of extra software you don't need for these steps.
4. Windows may ask "Do you want to allow this app to make changes to your device?" That's normal. Click **Yes**.
5. Close Command Prompt completely (click the **X** in the corner, or type `exit` and press Enter), then open it again.
6. Type `node -v` again to check it worked.

### 2. Check you have npm

npm stands for "Node Package Manager". It downloads and installs extra software, called **packages**, that other people have written. You'll use it to install the accessibility tools.

npm comes with Node.js, so if you have Node.js, you have npm too.

Type:

```bat
npm -v
```

You should see a version number, such as `10.9.2`. Any number means npm is working.

**If you see "'npm' is not recognized as an internal or external command":** install (or reinstall) Node.js using the steps above. npm comes with it.

### 3. Install Google Chrome

The accessibility tool opens Google Chrome behind the scenes to check your pages, so you need Chrome installed.

Windows only comes with Microsoft Edge, not Chrome. So unless you've installed Chrome yourself, download it from [google.com/chrome](https://www.google.com/chrome).

### 4. Show file name extensions

A file name extension is the part at the end of a file name after the dot, like `.js` in `check.js`. It tells your computer what kind of file it is.

Windows hides extensions by default. That means a file actually called `check.js.txt` can look like `check.js`, and the tools won't work with it. Turning extensions on lets you see the real name.

**On Windows 11:**

1. Open **File Explorer** (press **Windows key + E**).
2. Click **View** in the menu at the top.
3. Point to **Show**, then click **File name extensions** so it has a tick next to it.

**On Windows 10:**

1. Open **File Explorer** (press **Windows key + E**).
2. Click the **View** tab at the top.
3. Tick the **File name extensions** box.

**A note on editing code files:** a proper code editor such as [VS Code](https://code.visualstudio.com) is the most reliable choice. Notepad also works, as long as the file already exists with the right name, which is how these steps use it. The thing to avoid is **Save As** in Notepad. That's when it adds `.txt` to the end of the name, unless you change **Save as type** to **All files** first.

### 5. Create a project folder

You'll keep everything for these steps in one folder.

**Don't put it in Documents.** On many Windows computers, especially new ones, the Documents folder is synced to OneDrive. The tools you're about to install contain thousands of small files, and OneDrive will try to upload every one of them, which is slow and messy. Instead, you'll make the folder in your user folder, which OneDrive doesn't reach.

Type these commands one at a time:

```bat
cd %USERPROFILE%
```

`cd` stands for "change directory". (Directory is another word for folder.) `%USERPROFILE%` is a shortcut that means "my user folder", which is `C:\Users\` followed by your user name. This moves you into that folder.

```bat
mkdir axe-learning
```

`mkdir` stands for "make directory". This creates a new folder called `axe-learning` inside your user folder.

```bat
cd axe-learning
```

This moves you into the new folder.

**To check it worked, type:**

```bat
cd
```

Typing `cd` on its own shows you which folder you're in. You should see something like `C:\Users\yourname\axe-learning`.

**Important:** from now on, every command should be typed while you're inside this folder. If you close Command Prompt and come back later, you'll need to move back into the folder first. Type `cd %USERPROFILE%\axe-learning` and press Enter.

### 6. Turn the folder into a project

Type:

```bat
npm init -y
```

This turns your folder into a project, which means npm can install tools into it. The `-y` stands for "yes", and accepts all the default settings for you, so you won't be asked any questions.

You'll see some text appear on screen. That's npm showing you what it created, a file called `package.json`. Think of this file as the project's notebook: it keeps a list of the tools you install.

**To check it worked, type:**

```bat
dir
```

`dir` is short for "directory", and shows the files in your folder. You should see `package.json` in the list.

### 7. Install the accessibility tools

Type:

```bat
npm install @axe-core/cli playwright @axe-core/playwright
```

This installs three tools in one go. It may take a minute.

- **`@axe-core/cli`** checks a web page for accessibility problems when you type one command. "CLI" stands for "command line interface", which just means a tool you use by typing commands rather than clicking buttons.
- **`playwright`** controls a web browser automatically. It can open pages, click buttons and fill in forms, just like a person would.
- **`@axe-core/playwright`** lets the accessibility checker run while Playwright is in control of the browser. This is useful for pages that need you to log in or click through steps before you check them.

You'll notice a new folder called `node_modules` appears in your project folder. That's where npm stores the tools it installed. You never need to open it or change anything in it.

**To check it worked, type:**

```bat
npm ls
```

You should see the three tools listed, each with a version number.

### 8. Download Playwright's browser

Playwright uses its own copy of a browser, separate from the Chrome you normally use. Type:

```bat
npx playwright install chromium
```

Chromium is the free, open-source browser that Google Chrome is built on. This download may take a minute or two.

You'll see progress bars while it downloads. It's finished when the `C:\...>` line comes back.

### 9. Run your first check

Type:

```bat
npx axe https://example.com
```

`npx` comes with npm. It runs a tool you've installed in your project. Here it runs axe, which:

1. opens the page in an invisible copy of Chrome
2. checks it for common accessibility problems
3. lists any problems it finds.

It can take a few seconds, so be patient. When it's done, you'll see a list of any problems it found, followed by a line saying how many it found in total.

To check a different page, replace `https://example.com` with that page's address.

**If you see an error mentioning "session not created" or "This version of ChromeDriver only supports Chrome version":** this means the copy of Chrome on your computer is newer than the tool expects.

axe uses a helper program called **ChromeDriver** to control Chrome, and each copy of ChromeDriver only works with one main version of Chrome. Chrome updates itself every few weeks, so this error is common. To fix it, install a ChromeDriver that matches your Chrome:

1. Find your Chrome version in the error. Look for a line like `Current browser version is 155.0.8059.80`. The first number, in this case `155`, is the main version.
2. Type this, replacing `155` with your number:

```bat
   npm install chromedriver@155
```

3. Run the check again, this time telling axe to use the new ChromeDriver:

```bat
   npx axe https://example.com --chromedriver-path "node_modules\chromedriver\lib\chromedriver\chromedriver.exe"
```

From now on, include the `--chromedriver-path` part every time you run a check. In rung 2, you'll set this up once in a shortcut, so you won't have to keep typing it.

When Chrome updates and the error comes back, repeat these steps with the new version number.