/**
 * Parses a query string into an object.
 *
 * @param {string} queryString The query string to parse (e.g., "foo=bar&baz=qux").
 * @returns {object} An object representing the parsed query string.
 */
function parseQueryString(queryString) {
  if (!queryString) {
    return {};
  }

  const params = {};
  const pairs = queryString.startsWith('?') ? queryString.substring(1).split('&') : queryString.split('&');

  for (const pair of pairs) {
    if (!pair) continue; // Skip empty pairs that might result from "&&" or trailing "&"

    const parts = pair.split('=');
    const key = decodeURIComponent(parts[0]);
    let value = parts.length > 1 ? decodeURIComponent(parts[1].replace(/\+/g, ' ')) : ''; // Replace '+' with space for form-encoded data

    if (key === "") continue; // Skip if key is empty after decoding

    if (params.hasOwnProperty(key)) {
      if (!Array.isArray(params[key])) {
        params[key] = [params[key]];
      }
      params[key].push(value);
    } else {
      params[key] = value;
    }
  }
  return params;
}

// Export the function if using a module system (e.g., Node.js or ES6 Modules)
// For Node.js:
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseQueryString };
}
// For ES6 Modules (you'd typically have `export function parseQueryString...` above)
// export { parseQueryString };
