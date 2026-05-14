# Security Specification for GoGo AI Studio

## 1. Data Invariants
- A user profile (`users/{userId}`) can only be created with a 'free' plan initially.
- A user cannot change their own 'plan' field.
- A user cannot change their own 'isAdmin' field.
- A project (`projects/{projectId}`) must have a valid `userId` matching the creator.
- Users can only read and write their own documents.

## 2. The "Dirty Dozen" Payloads (Deny cases)
1. Creating a user with `isAdmin: true`.
2. Updating a user profile to `plan: "studio"` without payment (admin only change).
3. Creating a project for another user (`userId` mismatch).
4. Reading another user's chat history.
5. Updating a project's `resultUrl` directly from the client (if it's supposed to be server-only, but here for simplicity we might allow it if it's a demo, but let's assume it's protected).
6. Deleting another user's project.
7. Injecting a massive string ( > 1MB) into a project prompt.
8. Injection of script tags into display names.
9. Modifying `createdAt` during an update.
10. Listing all users (blanket read).
11. Bypassing email verification for sensitive writes (if applicable).
12. Creating a project with an invalid status like `status: "hacked"`.

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify these scenarios by attempting unauthorized operations using the Firebase Emulator or Mocking.
