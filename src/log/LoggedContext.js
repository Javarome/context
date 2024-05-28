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

  enter(otherName, data = new Map()) {
    this.checkAlive()
    return new LoggedContext(otherName, data, this)
  }

  /**
   * @param {(LoggedContext) => {}} func
   * @param {string} funcContextName
   * @param {Map} data
   * @return {any}
   */
  exec(func, funcContextName = Context.getName(func), data = new Map()) {
    return super.exec(func, funcContextName, data)
  }

  /**
   *
   * @param {(LoggedContext) => Promise<any>} executor
   * @param {string} asyncContextName
   * @param {Map} data
   * @return {Promise<Context>}
   */
  async execAsync(executor, asyncContextName = Context.getName(executor), data = new Map()) {
    return super.execAsync(executor, asyncContextName, data)
  }
}
