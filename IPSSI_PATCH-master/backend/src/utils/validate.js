function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function toInt(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

module.exports = { isNonEmptyString, toInt };
