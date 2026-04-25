# Database Schema

## Tables

### users
- id
- full_name
- username
- email
- password
- role

### problems
- id
- title
- code
- statement
- difficulty
- time_limit
- memory_limit
- tags

### testcases
- id
- problem_id
- input_data
- expected_output
- is_sample

### contests
- id
- title
- description
- start_time
- end_time
- status

### contest_problems
- id
- contest_id
- problem_id

### submissions
- id
- user_id
- problem_id
- language
- source_code
- verdict

### leaderboards
- id
- contest_id
- user_id
- username
- solved
- penalty
- rank