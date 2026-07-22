import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Vine Solutions gateway", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Vine Solutions \| Client Onboarding &amp; Employee Academy<\/title>/i,
  );
  assert.match(html, /Operations that/);
  assert.match(html, /Client Onboarding/);
  assert.match(html, /Employee Training/);
  assert.match(html, /Built for Amazon DSP operations/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("ships production content, progress, and responsive safeguards", async () => {
  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage/);
  assert.match(page, /clientPhases/);
  assert.match(page, /trainingModules/);
  assert.match(page, /Time & Attendance Management/);
  assert.match(page, /does not edit timecards|retains timecard edits/i);
  assert.match(layout, /Vine Solutions \| Client Onboarding/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);

  await access(new URL("../public/vine-solutions-logo.png", import.meta.url));
});

test("includes secure client onboarding and administrator export infrastructure", async () => {
  const [portal, schema, workflow, readme] = await Promise.all([
    readFile(new URL("../app/client-portal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"),
    readFile(
      new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(portal, /Welcome to Vine Solutions/);
  assert.match(portal, /Create client account/);
  assert.match(portal, /All changes saved/);
  assert.match(portal, /Search by DSP company name/);
  assert.match(portal, /Download CSV/);
  assert.match(schema, /enable row level security/i);
  assert.match(schema, /public\.is_admin\(\)/);
  assert.match(workflow, /VITE_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(readme, /Do not flatten the folders/);
});
