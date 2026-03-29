

## Plan: Grade-Based Content System (Grades 6-12)

### Overview
Add a grade selection system so students see only grade-appropriate subjects, quizzes, flashcards, matching pairs, and word scrambles. Grade is collected during signup and stored in the profile.

### Database Changes

**1. Add `grade` column to `profiles` table**
- Migration: `ALTER TABLE profiles ADD COLUMN grade integer DEFAULT NULL;`
- Nullable initially so existing users can set it on next login

### Auth & Onboarding Changes

**2. Update AuthPage signup form**
- Add a grade dropdown (6-12) shown during signup
- Pass grade in `options.data` metadata: `{ display_