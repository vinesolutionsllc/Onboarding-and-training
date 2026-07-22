# Exact GitHub Pages Instructions for Vine Solutions

## What went wrong

The first upload contained editable source files, but their folders were flattened. For example:

- `page.tsx`, `layout.tsx`, and `globals.css` belong inside `app/`
- `vine-solutions-logo.png` belongs inside `public/`
- `_journal.json` belongs inside `drizzle/meta/`
- `rendered-html.test.mjs` belongs inside `tests/`

More importantly, GitHub Pages cannot run `.tsx`, TypeScript, Next.js, or vinext source code. GitHub Pages needs a compiled static website whose root contains `index.html`. Because the repository had no compiled `index.html`, GitHub showed the repository README instead of the website.

## Use this package

Download and extract:

`vine-solutions-github-pages-upload.zip`

After extraction, the folder must contain at least:

```text
index.html
assets/
  index-[generated-name].css
  index-[generated-name].js
vine-solutions-logo.png
README.md
.nojekyll
```

The generated letters and numbers in the CSS and JavaScript filenames may differ. Do not rename them because `index.html` points to those exact filenames.

## Repair the existing repository - easiest method

You can keep the existing repository and URL. The old flattened files are untidy, but they will not prevent the website from working once the compiled site is uploaded.

### Part 1 - Extract the correct package

1. Download `vine-solutions-github-pages-upload.zip`.
2. In Windows File Explorer, right-click the ZIP.
3. Select **Extract All**.
4. Click **Extract**.
5. Open the extracted folder.
6. Confirm that `index.html` is visible.
7. Confirm that `assets` is a folder, not a ZIP file.
8. Open `assets` and confirm it contains one `.css` file and one `.js` file.

### Part 2 - Upload the compiled website

1. Open the GitHub repository: `vinesolutionsllc/Onboarding-and-training`.
2. Make sure you are on the **Code** tab.
3. Make sure the selected branch is **main**.
4. Click **Add file**.
5. Click **Upload files**.
6. Return to the extracted package in File Explorer.
7. Press **Ctrl+A** inside the extracted folder to select all its contents.
8. Drag the selected contents into GitHub's upload area.
9. Important: drag the `assets` folder itself. Do not open it and upload its files to the repository root.
10. Wait until every file finishes uploading.
11. Confirm the GitHub upload list contains `index.html`.
12. Confirm it contains paths beginning with `assets/`, such as `assets/index-...css` and `assets/index-...js`.
13. In the commit message box, enter: `Deploy compiled Vine Solutions portal`.
14. Select **Commit directly to the main branch**.
15. Click **Commit changes**.

You do not upload the ZIP itself. You upload the contents extracted from the ZIP.

### Part 3 - Configure GitHub Pages

1. In the repository, click **Settings**.
2. In the left menu, click **Pages** under **Code and automation**.
3. Under **Build and deployment**, find **Source**.
4. Select **Deploy from a branch**.
5. Under **Branch**, select **main**.
6. In the folder menu beside it, select **/(root)**.
7. Click **Save**.
8. Wait approximately one to five minutes.
9. Open the repository's **Actions** tab.
10. Look for the **pages build and deployment** workflow.
11. Wait until it shows a green check mark.
12. Return to **Settings > Pages**.
13. Open the published-site link shown by GitHub.

Expected URL:

`https://vinesolutionsllc.github.io/Onboarding-and-training/`

### Part 4 - Force the browser to load the new version

1. Open the published URL.
2. Press **Ctrl+Shift+R** on Windows to perform a hard refresh.
3. If the README still appears, open an Incognito window and try the URL again.
4. Confirm that the page begins with the Vine Solutions navigation and the headline **Operations that grow with you.**
5. Click **Client Onboarding** and confirm the five onboarding phases appear.
6. Return to the gateway.
7. Click **Employee Training** and confirm all four training modules appear.

## What to do with the old flattened files

They can remain temporarily because `index.html` will take priority. For a cleaner repository, remove the unrelated root-level source files later or keep the editable source in a separate private repository.

Do not delete these compiled website items:

- `index.html`
- the complete `assets/` folder
- `vine-solutions-logo.png`
- `.nojekyll`

## Common problems

### GitHub still shows the README

- Confirm `index.html` is at the repository root, not inside another folder.
- Confirm Pages is set to **main** and **/(root)**.
- Wait for the Pages workflow to finish.
- Hard-refresh with **Ctrl+Shift+R**.

### The page is blank or unstyled

- Confirm the `assets` folder exists.
- Confirm the `.css` and `.js` files remain inside `assets/`.
- Do not rename generated asset files.
- Re-upload the complete extracted package if any files are missing.

### The logo is missing

- Confirm `vine-solutions-logo.png` is at the same repository level as `index.html`.
- File names on GitHub Pages are case-sensitive.

### The site works but progress disappears on another device

This is expected in the current version. Completion progress is stored in the visitor's browser. Supabase is not required for this deployment. Supabase would be a later phase for accounts, cross-device progress, reporting, certificates, or secure uploads.

## Files that should never be uploaded

- `node_modules/`
- `.git/`
- `work/`
- `outputs/`
- `.env` or `.env.local`
- API keys, database passwords, or Supabase service-role keys
