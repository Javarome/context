# context
Allows to manage scoped data. 

## Usage

```js
const someContext = new Context("some context name")
```

### Read/write values
```js
someContext.set("someKey", "someValue")
someContext.set("other key", new OtherValue())
const someValue = someContext.get("someKey")
```

### Nesting
```js
const subContext = someContext.enter("sub context")
try {
  subContext.set("sub value", new OtherValue())
  const someValue = someContext.get("someKey")  // Still get data from parent context
  subContext.set("someKey", "someSubValue")     // Now overrides parent value
} finally {
  subContext.leave()
}
```

### Nested execution
A convenience method to automatically create a nested context and leaving it once executed.

```js
const wasntDone = someContext.exec(nestedContext => (nestedContext, otherParam) => {
  const wasDone = nestedContext.get("nestedDone")
  nestedContext.set("nestedDone", true)
  return !wasDone
})
```
same for async functions:
```js
const wasntDone = await someContext.execAsync(nestedContext => async(nestedContext, otherParam) => {
  const wasDone = nestedContext.get("nestedDone")
  await something()
  nestedContext.set("nestedDone", true)
  return !wasDone
})
```

### Logging
A `LoggedContext` is a `Context` with a built-in `Logger`.
It overrides the `enter()`, `exec()`, `execAsync()` APIs to set logging prefixes describing the current/nested context.
For instance:
```js
const someContext = new LoggedContext("some context")
someContext.logger.log("running")                     // Prints "some context: running"
const subContext = someContext.enter("sub context")
try {
  subContext.logger.log("running")                    // Prints "some context-sub context: running"
} finally {
  someContext.logger.log("stopping")                  // Prints "some context: stopping"
  subContext.leave()
}
```
