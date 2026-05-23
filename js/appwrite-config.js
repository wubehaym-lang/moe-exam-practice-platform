// =============================================================
//  APPWRITE CONFIGURATION — moe-exam-platform
//  Fill in YOUR values from the Appwrite Cloud console.
//
//  SETUP STEPS (one-time, takes ~5 minutes):
//  ──────────────────────────────────────────
//  1. Go to https://cloud.appwrite.io  and sign up (free, no card)
//  2. Click "Create project" → give it any name → copy the Project ID
//  3. Left menu → Databases → "Create database" → give it any name → copy Database ID
//  4. Inside that database → "Create collection" → name it "mirror" → copy Collection ID
//  5. In the collection → "Attributes" tab → "+ Create attribute":
//       Type   : String
//       Key    : key        (exactly this word)
//       Size   : 512
//       Required: YES
//
//       Type   : String
//       Key    : value      (exactly this word)
//       Size   : 131072     (128 KB — enough for all student data)
//       Required: NO
//
//  6. In the collection → "Settings" tab → Permissions:
//       Click "+ Add role" → choose "Any"
//       Tick: CREATE  READ  UPDATE  DELETE  → Save
//
//  7. Replace the placeholder strings below with your real IDs.
// =============================================================

window.APPWRITE_CONFIG = {
  endpoint    : "https://cloud.appwrite.io/v1",
  projectId   : "YOUR_PROJECT_ID",       // ← paste here
  databaseId  : "YOUR_DATABASE_ID",      // ← paste here
  collectionId: "YOUR_COLLECTION_ID"     // ← paste here
};
