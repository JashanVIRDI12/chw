# Supabase → Firebase

## What uses Firebase

- `admin.html` loads `js/admin.js`: Firebase email/password login, session restoration, lead listing and deletion. Search, sorting, statistics, pagination, refresh and CSV export remain in the browser.
- `index.html` and `catalog.html` already load `js/pdf-download.js`; it now creates Firestore leads through `js/firebase-client.js`. No public page reads leads. Downloads still proceed if saving fails; failures are logged in the browser console.
- All web configuration is in `js/firebase-config.js`, populated with the supplied **chw-admin** values. The modular Firebase **12.19.0** SDK loads from Google's CDN; no build step is needed. No Supabase SDK, URL or key remains in runtime code. No Supabase Storage was used; PDFs remain static files.

## Project and admin setup

1. Use the existing **chw-admin** project in [Firebase Console](https://console.firebase.google.com/), or create a project on the **Spark** plan. Register a web app under Project settings and copy its configuration to `js/firebase-config.js` if using a different project. Browser config is public; never add service-account credentials to the site.
2. Create a **Cloud Firestore Standard edition** database with ID **(default)** in production mode and choose its region. Keep billing disabled. This site uses neither Cloud Functions nor Cloud Storage (the `storageBucket` identifier in the supplied config is unused). Standard edition's [free quota](https://firebase.google.com/docs/firestore/quotas#free-quota) includes 1 GiB, 50,000 reads/day and 20,000 writes/day. Each dashboard load/refresh reads the full leads collection; the 25-row pagination is local.
3. Under Authentication → Sign-in method, enable **Email/Password**. Under Authentication → Users, add each admin with a new password. Add the production domain and `localhost` to Authentication → Settings → Authorized domains. Existing Supabase sessions and passwords are not automatically transferred; for a small admin team, recreate accounts and distribute/reset their new passwords.
4. Publish the contents of **`firestore.rules`** in Firestore → Rules. For each admin, copy their **Firebase Authentication UID** and create a document at **`admins/<UID>`** in Firestore → Data (for example, with an `email` string field for reference). The document's existence grants access; its email field does not. Only the console/trusted Admin SDK can create or change membership. Delete the membership document to revoke database access.
5. Serve the repo over HTTP(S), for example `python3 -m http.server 8000`, and open `http://localhost:8000/admin.html`. ES modules cannot run via `file://`. Existing static hosting can stay in place. Publish the HTML and JavaScript together and invalidate any cached old `js/pdf-download.js` so it stops contacting Supabase.

The [security rules](https://firebase.google.com/docs/firestore/security/rules-conditions) grant admins lead reads, updates and deletes. As requested, public PDF forms have a **create-only exception**: they must supply exactly the six expected fields, bounded string values, a matching document ID and a server timestamp. Visitors cannot read, overwrite or delete leads, enumerate admins, or grant themselves membership. Other collections are denied. Signing in alone does not grant admin access. This public endpoint can still receive spam and consume quota; validation is not rate limiting.

## Move existing leads

Pause old-site submissions for the final export/cutover to avoid missing new rows. Back up Supabase first. In its SQL Editor, export the following result as a **raw JSON array** to `leads.json` (not the dashboard's CSV, which omits IDs and formats dates):

```sql
select coalesce(jsonb_agg(to_jsonb(l) || jsonb_build_object('id', l.id::text)), '[]'::jsonb)
from public.leads l;
```

Keep IDs as strings to preserve PostgreSQL bigint precision. In a **separate local folder outside this website**, place `leads.json` and a Firebase service-account key downloaded from Project settings → Service accounts. Install the migration-only SDK with `npm init -y` and `npm install firebase-admin`. Save this as `import-leads.mjs` in that folder:

```js
import { readFile } from 'node:fs/promises';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault(), projectId: 'chw-admin' });
const db = getFirestore();
const rows = JSON.parse(await readFile('leads.json', 'utf8'));
let imported = 0;
for (const row of rows) {
  const id = String(row.id);
  try {
    await db.collection('leads').doc(id).create({
      id, name: row.name, phone: row.phone, email: row.email,
      page: row.page ?? null,
      created_at: row.created_at == null ? null : Timestamp.fromDate(new Date(row.created_at))
    });
    imported++;
  } catch (error) {
    if (error.code !== 6) throw error; // Existing IDs are skipped, never overwritten.
  }
}
console.log(`Imported ${imported}; skipped ${rows.length - imported} existing leads.`);
```

Run `GOOGLE_APPLICATION_CREDENTIALS="$PWD/service-account.json" node import-leads.mjs` from that folder. Change `projectId` if targeting another project. This trusted, local Admin SDK import bypasses client rules and preserves historical dates; it does not require a deployed backend. Imports count toward daily writes, so split exports exceeding the remaining daily quota. Never copy the key or exported personal data into this repo or upload them to hosting.

Firestore documents retain `id`, `name`, `phone`, `email`, `page`, `created_at`. Old numeric IDs become string document IDs; new leads use Firestore-generated string IDs. Dates are stored as Firestore timestamps and converted to ISO strings when read by the dashboard. Re-running the importer skips existing documents, so perform the final import before admins begin deleting leads.

Before retiring Supabase, compare source/destination counts and sample dates, submit a PDF lead from both public pages, sign in and reload the admin, and check search, sorting, pagination, CSV, refresh and deletion of a test lead. Confirm anonymous users and signed-in users without an `admins/<UID>` document cannot read/update/delete leads or create admin memberships. Revoke unused Supabase keys and disable the old endpoint after cutover; removing them from source does not remove them from Git history or cached deployments.
