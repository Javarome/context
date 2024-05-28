import {Logger} from "./Logger.js"

export class ConsoleLogger extends Logger {

  constructor(name) {
    super(name)
  }

  /**
   *
   * @param {string} message
   */
  log(message) {
    console.log(super.format(message))
  }
}
