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
   * @param {any[]} data
   * @return void
   * @abstract
   */
  log(...data) {
    throw NotImplementedError()
  }

  /**
   * @protected
   * @return {string}
   */
  prefix() {
    return this.name + ": "
  }
}
