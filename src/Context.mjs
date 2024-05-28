import {Assert} from "./error/Assert.js"

export class Context {
  /**
   * @readonly
   * @type {"started"}
   */
  static STATUS_STARTED = "started"

  /**
   * @readonly
   * @type {"stopped"}
   */
  static STATUS_STOPPED = "stopped"

  /**
   * @readonly
   * @type {"exec$result"}
   */
  static EXEC_RESULT = "exec$result"

  /**
   * @type {number}
   */
  static #anonymousFuncCounter = 0

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

  /**
   * Creates a new context.
   *
   * @param {string} name The context name.
   * @param {Map} data Context initial data.
   * @param {Context} [parent] The parent context, if any.
   */
  constructor(name, data = new Map(), parent) {
    this.#name = name
    this.#parent = parent
    this.#data = data
    this.#status = Context.STATUS_STARTED
    this.#timeStart = Date.now()
  }

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

  /**
   * @return {string[]}
   */
  get names() {
    return [...(this.parent ? this.parent.names : []), this.name]
  }

  get status() {
    return this.#status
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

  static defaultName(func) {
    return func.name || "$" + Context.#anonymousFuncCounter++
  }

  /**
   * Execute a function in a sub-context.
   *
   * 1. A new sub-context is created;
   * 2. The function is executed. If it succeeds, the result, if any, is stored in its context as Context.EXEC_RESULT.
   * 3. Whether the function succeeds or fails, the sub-context is left.
   *
   * @see {leave}
   * @param {(Context) => {}} func
   * @param {string} funcContextName
   * @param {Map} data
   * @return {any}
   */
  exec(func, funcContextName = Context.defaultName(func), data = new Map()) {
    this.#checkNotFinished()
    const funcContext = this.enter(funcContextName, data)
    try {
      return func(funcContext)
    } finally {
      funcContext.leave()
    }
  }

  /**
   * Execute an asynchronous function in a sub-context.
   *
   * 1. A new sub-context is created;
   * 2. The function is executed. If it succeeds, the result, if any, is stored in its context as Context.EXEC_RESULT.
   * 3. Whether the function succeeds or fails, the sub-context is left.
   *
   * @see {leave}
   * @param {string} asyncContextName
   * @param {(Context) => Promise<any>} executor
   * @param {Map} data
   * @return {Promise<Context>}
   */
  async execAsync(executor, asyncContextName = Context.defaultName(executor), data = new Map()) {
    this.#checkNotFinished()
    const asyncContext = this.enter(asyncContextName, data)
    const asyncPromise = executor(asyncContext)
    return asyncPromise.finally(() => asyncContext.leave())
  }
}
