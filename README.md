# Pure JS Events

## Installation

```bash
pnpm i evemitter
```

## Usage

```ts
import EventEmitter from 'evemitter'

const emitter = new EventEmitter<{
  event1: (arg1: string, arg2: number) => void
  event2: (arg1: string) => void
}>()

emitter.on('event1', (arg1, arg2) => {
  console.log(arg1, arg2)
})

emitter.emit('event1', 'hello', 123)
```

## Note

The EventEmitter is typesafe. If you want a non-typesafe eventemitter, either pass `<any>` or use NodeEventEmitter.

Note that typesafety is not available in pure JS.
