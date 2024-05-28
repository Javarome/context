import {NotImplementedError} from "../error/NotImplementedError.js"

export class Logger {
  /**
   * @type {string}
   */
  #name

  /**
   * @protected
   * @param name
   */
  constructor(name) {
    this.#name = name
  }

  get name() {
    return this.#name
  }

  /**
   * @param {string} message
   * @return void
   * @abstract
   */
  log(message) {
    throw NotImplementedError()
  }

  /**
   * @protected
   * @param message
   * @return {string}
   */
  format(message) {
    return this.name + ": " + message
  }
}
