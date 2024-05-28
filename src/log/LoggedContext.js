import {Context} from "../Context.mjs"
import {ConsoleContextLogger} from "./ConsoleContextLogger.js"

export class LoggedContext extends Context {
  /**
   * @type {Logger}
   */
  logger

  /**
   *
   * @param {string} name
   * @param {Map} data
   * @param {Context} [parent]
   * @param {Logger} [logger]
   */
  constructor(name, data = new Map(), parent, logger) {
    super(name, data, parent)
    this.logger = logger || ConsoleContextLogger.from(this)
  }
}
