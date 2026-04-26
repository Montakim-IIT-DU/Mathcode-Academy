export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

export function validateLoginForm(values) {
  const errors = {};

  if (!isRequired(values.email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email";
  }

  if (!isRequired(values.password)) {
    errors.password = "Password is required";
  }

  return errors;
}

export function validateRegisterForm(values) {
  const errors = {};

  if (!isRequired(values.full_name)) {
    errors.full_name = "Full name is required";
  }

  if (!isRequired(values.username)) {
    errors.username = "Username is required";
  }

  if (!isRequired(values.email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email";
  }

  if (!isRequired(values.password)) {
    errors.password = "Password is required";
  } else if (!isValidPassword(values.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export function validateProblemForm(values) {
  const errors = {};

  if (!isRequired(values.title)) {
    errors.title = "Title is required";
  }

  if (!isRequired(values.code)) {
    errors.code = "Problem code is required";
  }

  if (!isRequired(values.statement)) {
    errors.statement = "Problem statement is required";
  }

  if (!isRequired(values.difficulty)) {
    errors.difficulty = "Difficulty is required";
  }

  if (!isRequired(values.topic)) {
    errors.topic = "Topic is required";
  }

  if (!isRequired(values.time_limit)) {
    errors.time_limit = "Time limit is required";
  }

  if (!isRequired(values.memory_limit)) {
    errors.memory_limit = "Memory limit is required";
  }

  return errors;
}

export function validateContestForm(values) {
  const errors = {};

  if (!isRequired(values.title)) {
    errors.title = "Contest title is required";
  }

  if (!isRequired(values.description)) {
    errors.description = "Contest description is required";
  }

  if (!isRequired(values.start_time)) {
    errors.start_time = "Start time is required";
  }

  if (!isRequired(values.end_time)) {
    errors.end_time = "End time is required";
  }

  if (!isRequired(values.contest_type)) {
    errors.contest_type = "Contest type is required";
  }

  if (values.contest_type === "Onsite" && !isRequired(values.venue)) {
    errors.venue = "Venue is required for onsite contests";
  }

  return errors;
}
