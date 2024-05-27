import {Assert} from "./Assert.js"

export class Context {
  static STATUS_STARTED = "started"
  static STATUS_STOPPED = "stopped"

  /**
   * @type {string}
   */
  #name
  /**
   * @type {number}
   */
  #timeStart
  /**
   * @type {number}
   */
  #timeEnd

  /**
   * @type {STATUS_STARTED | STATUS_STOPPED }
   */
  #status

  /**
   * @readonly
   * @type {Map<any, any>}
   */
  #data

  /**
   * @readonly
   * @type {Context | undefined}
   */
  #parent

  get parent() {
    return this.#parent
  }

  /**
   *
   * @param {any} key
   * @returns {any}
   */
  get(key) {
    return this.#data.get(key) || this.parent?.get(key)
  }

  /**
   *
   * @param {any} key
   * @return {Context | undefined}
   */
  ownerOf(key) {
    return this.#data.has(key) ? this : this.parent?.ownerOf(key)
  }

  /**
   *
   * @param {any} key
   * @param {any} value
   * @return this
   */
  set(key, value) {
    const owner = this.ownerOf(key)
    if (!owner || owner === this) {
      this.#data.set(key, value)
    } else {
      owner.set(key, value)
    }
    return this
  }

  get name() {
    return this.#name
  }

  get status() {
    return this.#status
  }

  /**
   *
   * @param {string} name
   * @param {Map} data
   * @param {Context} [parent]
   */
  constructor(name, data = new Map(), parent) {
    this.#name = name
    this.#parent = parent
    this.#data = data
    this.#status = Context.STATUS_STARTED
    this.#timeStart = Date.now()
  }

  #checkNotFinished() {
    Assert.notEqual(this.#status, Context.STATUS_STOPPED, `Context "${this.name}" is ${Context.STATUS_STOPPED}`)
  }

  /**
   * @param {string} otherName
   * @param {Map} data
   * @return {Context}
   */
  enter(otherName, data = new Map()) {
    this.#checkNotFinished()
    return new Context(otherName, data, this)
  }

  leave() {
    this.#checkNotFinished()
    this.#timeEnd = Date.now()
    this.#status = Context.STATUS_STOPPED
    return this.parent
  }

  /**
   * @param {(Context) => {}} func
   * @param {string} funcContextName
   * @param {Map} data
   * @return {Context}
   */
  exec(func, funcContextName = func.name, data = new Map()) {
    this.#checkNotFinished()
    const funcContext = this.enter(funcContextName, data)
    try {
      const result = func(funcContext)
      funcContext.set("exec$result", result)
    } finally {
      funcContext.leave()
    }
    return funcContext
  }

  /**
   * @param {string} asyncContextName
   * @param {(Context) => Promise<any>} executor
   * @param {Map} data
   * @return {Promise<Context>}
   */
  async execAsync(executor, asyncContextName = executor.name, data = new Map()) {
    this.#checkNotFinished()
    const asyncContext = this.enter(asyncContextName, data)
    const asyncPromise = executor(asyncContext)
    asyncPromise.then(result => {
      asyncContext.set("exec$result", result)
    }).finally(() => asyncContext.leave())
    return asyncContext
  }
}
