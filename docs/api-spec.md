# API Specification

## Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## Users
- GET /api/users/
- GET /api/users/{user_id}
- POST /api/users/
- PUT /api/users/{user_id}
- DELETE /api/users/{user_id}

## Problems
- GET /api/problems/
- GET /api/problems/{problem_id}
- POST /api/problems/
- PUT /api/problems/{problem_id}
- DELETE /api/problems/{problem_id}

## Contests
- GET /api/contests/
- GET /api/contests/{contest_id}
- POST /api/contests/
- PUT /api/contests/{contest_id}
- POST /api/contests/{contest_id}/join

## Submissions
- GET /api/submissions/
- GET /api/submissions/{submission_id}
- POST /api/submissions/

## Leaderboard
- GET /api/leaderboard/
- GET /api/leaderboard/contest/{contest_id}
- POST /api/leaderboard/

## Admin
- GET /api/admin/dashboard
- GET /api/admin/overview