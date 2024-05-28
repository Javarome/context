import {describe, test} from "node:test"
import {Context} from "./Context.mjs"
import assert from "node:assert"
import {LoggedContext} from "./log/LoggedContext.js"

describe("context", () => {

  describe("data access", () => {

    const initial = new Context("initial")
    const initialKey = "key1"
    const initialValue = "value1"

    test("local read/write", () => {
      assert.equal(initial.get(initialKey), undefined)
      initial.set(initialKey, initialValue)
      assert.equal(initial.get(initialKey), initialValue)
    })

    describe("nested", () => {

      const nestKey = "nestKey"
      const nestValue = "nestValue"
      const nestInitialValue = "nestInitialValue"
      const nested = initial.enter("nested")

      test("local read/write", () => {
        assert.equal(nested.get(nestKey), undefined)
        nested.set(nestKey, nestValue)
        assert.equal(nested.get(nestKey), nestValue)
        assert.equal(nested.ownerOf(nestKey), nested)
      })

      test("parent read/write", () => {
        assert.equal(nested.get(initialKey), initialValue)
        nested.set(initialKey, nestInitialValue)
        assert.equal(nested.get(initialKey), nestInitialValue)
        assert.equal(nested.ownerOf(initialKey), initial)
      })

      test("leave", () => {
        const parent = nested.leave()
        assert.equal(nested.status, Context.STATUS_STOPPED)
        assert.equal(parent, initial)
      })
    })
  })

  test("execute function", (t) => {
    const main = new LoggedContext(t.name)
    try {
      main.logger.log("starting")
      const func = (loggedContext, count) => {
        for (let i = 0; i < count; i++) {
          loggedContext.logger.log(i)
        }
        return count + 1
      }
      const max = 5
      const result = main.exec(funcContext => func(funcContext, max))
      assert.equal(result, max + 1)
    } finally {
      main.logger.log("stopped")
      main.leave()
    }
  })

  test("execute async function", async (t) => {
    const main = new LoggedContext(t.name)
    const asyncFunc = async (loggedContext, count) => {
      for (let i = 0; i < count; i++) {
        loggedContext.logger.log(i)
      }
      return count + 1
    }
    const max = 6
    const result = await main.execAsync(asyncFuncContext => asyncFunc(asyncFuncContext, max))
    assert.equal(result, max + 1)
  })
})
