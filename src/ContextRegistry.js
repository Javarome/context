export class ContextRegistry {
  /**
   *
   * @type {Map<any, Context>}
   */
  #registry = new Map()

  /**
   *
   * @param {any} key
   * @return {Context}
   */
  get(key) {
    return this.#registry.get(key)
  }

  /**
   *
   * @param {any} key
   * @param {Context} context
   */
  set(key, context) {
    this.#registry.set(key, context)
  }
}
