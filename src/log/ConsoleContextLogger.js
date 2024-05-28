import {Context} from "../Context.mjs"
import {ConsoleLogger} from "./ConsoleLogger.js"

export class ConsoleContextLogger {
  /**
   * @param {Context} context
   * @param {string} sep
   * @return {ConsoleLogger}
   */
  static from(context, sep = "-") {
    return new ConsoleLogger(context.names.join(sep))
  }
}
