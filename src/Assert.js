export class AssertionError extends Error {
  constructor(message) {
    super(message)
  }
}

/**
 * For runtime, not tests
 */
export class Assert {
  /**
   *
   * @param actual
   * @param expected
   * @param {string} [message]
   */
  static equal(actual, expected, message) {
    if (actual !== expected) {
      throw new AssertionError(message || `${actual} is not equal to ${expected}`)
    }
  }

  /**
   *
   * @param actual
   * @param expected
   * @param {string} [message]
   */
  static notEqual(actual, expected, message) {
    if (actual === expected) {
      throw new AssertionError(message || `${actual} is equal to ${expected}`)
    }
  }
}
