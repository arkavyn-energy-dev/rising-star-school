// Generates a short, human-readable reference code the applicant can quote
// when following up (e.g. "RSA-7K2N9X"). Not cryptographically unique on its
// own, so callers should retry on a rare duplicate-key error.
const generateReferenceId = (prefix = "RS") => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${random}`;
};

module.exports = generateReferenceId;
