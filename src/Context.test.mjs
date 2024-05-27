import {describe, test} from "node:test"
import {Context} from "./Context.mjs"
import assert from "node:assert"

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

  test("execute function", () => {
    const main = new Context("main")
    const func = (count) => {
      for (let i = 0; i < count; i++) {
        console.log(i)
      }
      return count + 1
    }
    const max = 30
    const funcContext = main.exec(funcContext => func(max))
    assert.equal(funcContext.status, Context.STATUS_STOPPED)
    assert.equal(funcContext.get("exec$result"), max + 1)
  })

  test("execute async function", async () => {
    const main = new Context("main")
    const asyncFunc = async (count) => {
      for (let i = 0; i < count; i++) {
        console.log(i)
      }
      return count + 1
    }
    const max = 30
    const asyncFuncContext = await main.execAsync(asyncFuncContext => asyncFunc(30))
    assert.equal(asyncFuncContext.get("exec$result"), max + 1)
  })
})
