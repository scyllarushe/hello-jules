// Import the function to be tested (assuming Node.js environment)
const { parseQueryString } = require('./utils.js');

// Helper function for deep equality check for objects
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      for (let i = 0; i < val1.length; i++) {
        if (val1[i] !== val2[i]) return false; // Simple comparison for array elements
      }
    } else if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (!deepEqual(val1, val2)) return false;
    } else if (val1 !== val2) {
      return false;
    }
  }
  return true;
}

// Test suite
function runTests() {
  let testsPassed = 0;
  let testsFailed = 0;

  function test(description, testFn) {
    try {
      testFn();
      console.log(`✅ PASSED: ${description}`);
      testsPassed++;
    } catch (error) {
      console.error(`❌ FAILED: ${description}`);
      console.error(error);
      testsFailed++;
    }
  }

  // --- Test cases will be added here in the next step ---

  test("should parse a basic query string", () => {
    const result = parseQueryString("foo=bar&baz=qux");
    console.assert(deepEqual(result, { foo: "bar", baz: "qux" }), "Test Case 1 Failed");
  });

  test("should handle an empty query string", () => {
    const result = parseQueryString("");
    console.assert(deepEqual(result, {}), "Test Case 2 Failed: Empty string");
    const resultNull = parseQueryString(null);
    console.assert(deepEqual(resultNull, {}), "Test Case 2 Failed: Null input");
    const resultUndefined = parseQueryString(undefined);
    console.assert(deepEqual(resultUndefined, {}), "Test Case 2 Failed: Undefined input");
  });

  test("should handle query string starting with ?", () => {
    const result = parseQueryString("?foo=bar&baz=qux");
    console.assert(deepEqual(result, { foo: "bar", baz: "qux" }), "Test Case 3 Failed");
  });

  test("should handle parameters with no values", () => {
    const result = parseQueryString("foo=&bar=baz");
    console.assert(deepEqual(result, { foo: "", bar: "baz" }), "Test Case 4.1 Failed");
    const result2 = parseQueryString("foo&bar=baz"); // Parameter without '='
    console.assert(deepEqual(result2, { foo: "", bar: "baz" }), "Test Case 4.2 Failed");
     const result3 = parseQueryString("foo=&bar=");
    console.assert(deepEqual(result3, { foo: "", bar: "" }), "Test Case 4.3 Failed");
  });

  test("should handle multiple parameters with the same name", () => {
    const result = parseQueryString("name=John&name=Doe&age=30");
    console.assert(deepEqual(result, { name: ["John", "Doe"], age: "30" }), "Test Case 5 Failed");
  });

  test("should handle URI encoded characters", () => {
    const result = parseQueryString("name=John%20Doe&city=New%20York");
    console.assert(deepEqual(result, { name: "John Doe", city: "New York" }), "Test Case 6 Failed");
  });

  test("should handle plus characters (+) as spaces in values", () => {
    const result = parseQueryString("name=John+Doe&city=New+York");
    console.assert(deepEqual(result, { name: "John Doe", city: "New York" }), "Test Case 7 Failed");
  });

  test("should handle a complex query string", () => {
    const result = parseQueryString("a=1&b=hello%20world&c=&d=foo&d=bar&e=a%3Db%26c%3Dd&f=name+with+spaces");
    console.assert(deepEqual(result, {
      a: "1",
      b: "hello world",
      c: "",
      d: ["foo", "bar"],
      e: "a=b&c=d",
      f: "name with spaces"
    }), "Test Case 8 Failed");
  });

  test("should ignore empty keys", () => {
    const result = parseQueryString("=value&foo=bar");
    console.assert(deepEqual(result, { foo: "bar" }), "Test Case 9.1 Failed: Leading empty key");
    const result2 = parseQueryString("foo=bar&=value");
    console.assert(deepEqual(result2, { foo: "bar" }), "Test Case 9.2 Failed: Trailing empty key");
     const result3 = parseQueryString("foo=bar&&baz=qux"); // empty pair
    console.assert(deepEqual(result3, { foo: "bar", baz: "qux" }), "Test Case 9.3 Failed: Empty pair");
  });

  test("should handle query string with only a question mark", () => {
    const result = parseQueryString("?");
    console.assert(deepEqual(result, {}), "Test Case 10 Failed");
  });

  test("should handle query string with only an ampersand", () => {
    const result = parseQueryString("&");
    console.assert(deepEqual(result, {}), "Test Case 11 Failed");
     const result2 = parseQueryString("&&");
    console.assert(deepEqual(result2, {}), "Test Case 11.2 Failed");
  });

  test("should handle parameter names and values with special characters", () => {
    const result = parseQueryString("param%26name=value%26another&other=100%25");
    console.assert(deepEqual(result, {"param&name": "value&another", "other": "100%"}), "Test Case 12 Failed");
  });

  console.log('\n--- Test Summary ---');
  console.log(`Total tests: ${testsPassed + testsFailed}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);

  if (testsFailed > 0) {
    // Exit with a non-zero code to indicate failure, useful for CI environments
    process.exit(1);
  }
}

// Run the tests
runTests();
