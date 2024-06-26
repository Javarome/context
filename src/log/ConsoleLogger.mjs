import {Logger} from "./Logger.mjs"

export class ConsoleLogger extends Logger {

  constructor(name) {
    super(name)
  }

  /**
   *
   * @param {any[]} data
   */
  log(...data) {
    console.log(super.prefix(), ...data)
  }
}
