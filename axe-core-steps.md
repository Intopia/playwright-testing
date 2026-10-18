# Learning axe-core in three rungs

This guide climbs a ladder in three rungs. You start by running axe-core by hand in a browser, and finish with a script that checks a page every time it changes.

**Before you start:** complete the "Getting set up" steps first. You should have:

- Node.js 22.12 or higher
- an `axe-learning` folder in Documents, already set up as a project
- the three axe and Playwright tools installed in that folder
- Google Chrome installed.

**The idea behind all three rungs:** load a page, inject axe into it, run axe, then do something with the results. Every axe tool, from browser extensions to big test suites, is just a different way of doing those four things.

---

## Rung 1: browser console

### Purpose

Find out what axe-core actually is by running it by hand, with no extra tools. By the end, you'll see that browser extensions like axe DevTools do the same steps, just with a nicer interface on top.

### Steps

#### 1. Create the test page

This page has 7 deliberately planted accessibility errors, each labelled with a comment. Because you know exactly what's wrong with it, you'll be able to tell whether axe's results are right.

If you're not already in your `axe-learning` folder, move into it first (see "Getting set up").

**Windows:** create an empty file, then open it in Notepad:

```
type nul > test-page.html
notepad test-page.html
```

**Mac:** create an empty file, then open it in your code editor. For example, if you use VS Code:

```
touch test-page.html
code test-page.html
```

Paste the following into the file, then save it (**Ctrl + S** on Windows, **Command + S** on Mac):

```html
<!DOCTYPE html>
<!-- ERROR 1: no lang attribute on the html element -->
<html>
<head>
  <meta charset="utf-8">
  <title>axe test page</title>
  <style>
    .faint { color: #aaa; }
  </style>
</head>
<body>
  <main>
    <h1>axe test page</h1>

    <!-- ERROR 2: heading level skips from h1 to h3 -->
    <h3>A section</h3>

    <!-- ERROR 3: image with no alt attribute -->
    <img src="photo.jpg">

    <!-- ERROR 4: text input with no label -->
    <input type="text">

    <!-- ERROR 5: button with no accessible name -->
    <button></button>

    <!-- ERROR 6: link with no text -->
    <a href="#"></a>

    <!-- ERROR 7: low contrast text (grey on white) -->
    <p class="faint">This text is hard to read.</p>
  </main>
</body>
</html>
```

Watch out for:

- On Windows, don't use `start test-page.html` to open the file. That opens it in a browser, not an editor.
- On Mac, avoid TextEdit. It can save files as formatted text instead of plain code.
- The page uses an image that doesn't exist. That's on purpose, because axe only cares about the markup.

#### 2. Open the page in Chrome

Open the test page in Chrome, since its console is the easiest to work with.

**Windows:**

```
start chrome test-page.html
```

**Mac:**

```
open -a "Google Chrome" test-page.html
```

You should see a heading, a broken image icon, an empty text box, a tiny empty button and some faint grey text.

Watch out for:

- Opening the file without saying "Chrome" uses your default browser, which may be something else (Edge on Windows, Safari on Mac).

#### 3. Open the console

Open Chrome's developer tools and go to the **Console** tab. This is where you'll type JavaScript straight into the page.

- **Windows:** Ctrl + Shift + J
- **Mac:** Command + Option + J

Watch out for:

- Click on the web page first. Otherwise the shortcut goes to whichever app is in front, such as your command line app.
- If the shortcut doesn't work, right-click anywhere on the page, choose **Inspect**, then click the **Console** tab.
- You'll see a red error about `photo.jpg` failing to load. That's expected, so ignore it.

#### 4. Load axe-core into the page

Paste this code into the console and press Enter. It adds the axe-core script to the page. It's the same as writing a `<script>` element into the HTML, just done live.

```js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js';
document.head.appendChild(script);
```

In plain terms:

1. Make a new `<script>` element.
2. Point it at the axe-core file, which is hosted online.
3. Add it to the page, so the browser downloads and runs it.

Watch out for:

- Chrome may block your first paste. If it does, type `allow pasting`, press Enter, then paste again.
- The address includes a version number (`axe-core@4.14.0`), so the console uses the same axe version as the other rungs.

#### 5. Check axe has loaded

Type this and press Enter:

```js
axe.version
```

You should see `'4.14.0'`. That means axe is now running inside the page, waiting to be told what to do.

Watch out for:

- If you see "axe is not defined", the file may still be downloading. Wait a couple of seconds and try again.

#### 6. Run axe

Paste this and press Enter:

```js
const results = await axe.run();
```

In plain terms: "run axe on the whole page, wait for it to finish, and store everything it found in a box called `results`."

Nothing will happen yet. axe has run, but the results are sitting in the box, waiting for you to look at them. The console will just show `undefined`, which means the line ran and had nothing to show.

Then check how many rules failed:

```js
results.violations.length
```

You should see `7`, one for each planted error.

Watch out for:

- The count is the number of **rules that failed**, not individual problems. Three images with no alt text would still count as one failed rule.

#### 7. Explore the four buckets

Type this and press Enter:

```js
results
```

Click the small triangle at the start of the line to expand it. Near the bottom, you'll find four groups, each with a count in brackets:

- **violations:** rules that failed (7)
- **passes:** rules that passed
- **incomplete:** rules axe couldn't decide on, so a human needs to check
- **inapplicable:** rules with nothing to check on this page, such as table rules on a page with no tables

This four-way split is the heart of how axe works. It never says a page is accessible, only what it could and couldn't confirm.

Watch out for:

- The groups are listed in alphabetical order, mixed in with other details such as the page address and the time of the test.
- The rules under **inapplicable** look like errors, because each one is described as a requirement. They're not errors, just rules that didn't apply.

#### 8. Show the violations as a table

Paste this and press Enter:

```js
console.table(results.violations.map(v => ({
  rule: v.id,
  impact: v.impact,
  instances: v.nodes.length,
  help: v.help
})));
```

In plain terms: "for each violation, pull out four things (the rule's name, how severe it is, how many elements failed and a short description), then show them as a table."

You should see a table with 7 rows: 3 critical, 3 serious and 1 moderate.

Watch out for:

- axe lists rules alphabetically, not by severity or by where they appear on the page.

#### 9. Filter to critical and serious

Paste this and press Enter:

```js
results.violations
  .filter(v => v.impact === 'critical' || v.impact === 'serious')
  .forEach(v => console.log(v.impact, v.id));
```

In plain terms: "keep only the violations that are critical or serious, then print each one on its own line."

You should see 6 lines. `heading-order` is gone, because it's moderate.

axe itself always reports everything. Every tool that lets you filter by severity is doing exactly this, afterwards, on the results.

Watch out for:

- axe has four impact levels: critical, serious, moderate and minor. There's no "high".

#### 10. See which elements failed

Paste this and press Enter:

```js
results.violations.forEach(v =>
  v.nodes.forEach(n => console.log(v.id, '|', n.target.join(' '), '|', n.html))
);
```

In plain terms: "for each violation, go through every element that failed it, and print the rule's name, the element's CSS selector (the **target**) and its HTML."

You should see 7 lines, each showing the problem code from your test page, such as `<img src="photo.jpg">` on the `image-alt` line. This answers the "where on the page?" question.

Watch out for:

- On this small page, each target is just an element name like `img`. On a real site, it would be a longer selector that points to one exact element.

#### 11. Bonus: all in one script

Now that you understand each piece, here's everything in one go. Reload the page first, so you start fresh. Then paste this and press Enter:

```js
{
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js';

  script.onload = async () => {
    const results = await axe.run();
    console.log(results);
    console.table(results.violations.map(v => ({
      Rule: v.id,
      Impact: v.impact,
      Description: v.help,
      Elements: v.nodes.length
    })));
  };

  script.onerror = () => console.log('axe-core could not load. This site may block outside scripts.');

  document.head.appendChild(script);
}
```

In plain terms: "load axe, and as soon as it's ready, run it, show the full results, then show the violations as a table." The curly brackets around the code mean you can paste it again without causing an error.

Watch out for:

- This works on most web pages, not just your test page. Some sites block scripts from outside addresses, so on those you'll see the "could not load" message instead.

#### Optional: compare with the axe DevTools extension

Run the axe DevTools extension on the same page and compare the counts. It's the same engine, so you should get the same results.

Watch out for:

- The extension's **Best Practices** setting changes the count. Turn it off and `heading-order` disappears, because it's a best practice rule, not a WCAG requirement.


---

## Rung 2: command line

### Purpose

Run axe without opening a browser yourself, save the results to a file, and turn them into a readable report.

### Steps

#### 12. Run axe from the command line

Run one command that opens an invisible copy of Chrome, loads the page, injects axe and lists the problems. It's the same steps as rung 1, done for you.

```bat
npx axe "file:///%cd%/test-page.html" --chromedriver-path "node_modules\chromedriver\lib\chromedriver\chromedriver.exe"
```

In plain terms: "run axe on the test page in this folder, using the ChromeDriver you installed during setup."

- `file:///` tells axe the page is a file on your computer, not a website.
- `%cd%` fills in the folder you're currently in, so you don't have to type the whole path.

You should see 7 issues, the same as in rung 1.

Watch out for:

- Check the first line of the output. It should say `Testing file:///C:/Users/...`. If it says `Testing http://test-page.html`, the `file:///` part is missing, and axe is checking an error page instead of your file.
- Keep the quotes around the page address and the ChromeDriver path.
- If you skipped the ChromeDriver fix in "Getting set up", leave out the `--chromedriver-path` part.
- The command line output doesn't show impact levels, and has no option to filter by them.

#### 12. Run WCAG rules only

Add `--tags wcag2a,wcag2aa` to only run rules for WCAG levels A and AA. This does the same job as turning off the extension's Best Practices setting.

Watch out for:

- Each WCAG version has its own tags. Testing against WCAG 2.2 AA means listing them all: `wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa`.

#### 13. Save the results to a file

Add `--save results.json` to save the full results as a JSON file.

Watch out for:

- Each run replaces the file with the latest results.

#### 14. Explore the JSON file

Open `results.json` and find the same groups and fields you saw in the console: violations, impact, nodes, tags, help and the "how to fix" summaries.

Watch out for:

- A JSON viewer extension, such as JSON Formatter, makes the file much easier to read.
- The rules under **inapplicable** look like errors, but they're rules that had nothing to check.
- `"impact": null` means the rule passed or didn't apply. Impact is only filled in when something fails.

#### 15. Write a reporting script

Create `make-report.js`, a script that reads `results.json` and writes a full HTML report. The report includes test details, a summary, every violation with its tags and description, the failing elements with "how to fix" text, and a needs-review list.

Watch out for:

- The command line tool saves a **list** of results, one for each page tested, so the script reads the first item.
- Any HTML in the results has to be escaped. Otherwise code like `<button></button>` would show up in the report as a real button.

#### 16. Run the report

Run `node make-report.js`, then open `report-full.html`.

Watch out for:

- The report only shows what's in the latest `results.json`. Run step 13 again first if you've changed the page.

#### 17. Add a shortcut command

Add a `report` script to `package.json`, so one short command runs axe and builds the report: `npm run report`.

Watch out for:

- JSON is very fussy. One missing comma or quote mark breaks the whole file.
- Quote marks inside a JSON value need a backslash in front, like `\"`.

#### Optional: check the report itself

Run axe on `report-full.html`. An accessibility report should have no accessibility problems of its own.

---

## Rung 3: script with Playwright

### Purpose

Control everything with your own code: what gets tested, what gets shown, and when it runs. By the end of this rung, you'll have a check that shows only critical and serious issues, re-runs whenever the page changes, writes a report and passes or fails.

### Steps

#### 18. Write a basic check script

Create `check.js`, a script that uses Playwright to open the page and the axe add-on to run axe, then prints how many violations it found.

Watch out for:

- Save the file into your `axe-learning` folder. A "Cannot find module" error usually means it saved somewhere else.
- The tab has to be opened inside a browser context (`browser.newContext()`). Opening it straight from the browser causes a "Please use browser.newContext()" error.

#### 19. Show only critical and serious

Filter the violations to critical and serious, then print each one with its impact, rule, help text and failing HTML. The command line tool can't do this, which is why rung 3 is needed.

#### 20. Sort the most severe issues to the top

Sort the list so critical issues appear before serious ones.

#### 21. Re-run whenever the page changes

Use Node's watch mode to re-run the script every time `test-page.html` is saved. This simulates a developer fixing problems as they work.

Watch out for:

- Watch mode keeps running, so you won't get your Terminal prompt back. Press **Control + C** to stop it.
- The screen clears before each run, so it can look like a new window.

#### 22. Add check and watch shortcuts

Add `check` and `watch` scripts to `package.json`.

Watch out for:

- `npm run check` runs once and stops. `npm run watch` keeps running and re-checks on every save.

#### 23. Write a simple HTML report

Add code to `check.js` that saves the critical and serious issues as `report.html`.

Watch out for:

- This report is separate from the full report in rung 2. It only shows critical and serious issues.

#### 24. Pass or fail

End the script with a clear PASS or FAIL, and set an **exit code**. An exit code is a number every command reports when it finishes. 0 means success, and anything else means failure. This is how automated build tools decide whether to block code.

Watch out for:

- npm adds a few error lines of its own when the script fails. That's not a bug, it's npm noticing the exit code.
- The PASS or FAIL message only appears in Terminal, not in the report.

#### 25. Fix the page and reach PASS

Run watch mode, fix the six critical and serious problems one at a time, and watch the count drop to zero and PASS.

Watch out for:

- The `heading-order` problem is still on the page at PASS, because it's moderate. A good reminder of what severity filters let through.
- Keep a broken copy of the page, such as `test-page-broken.html`, so you can reset it before a demo.
