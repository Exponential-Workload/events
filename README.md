# @3xpo/events

[![documentation](https://img.shields.io/badge/-documentation-brightgreen.svg)](https://gh.expo.moe/events/) [![mom made pizza](https://img.shields.io/badge/type-safe-blue.svg)](https://typescriptlang.org/) [![mom made pizza](https://img.shields.io/badge/mom%20made-pizza-white.svg)](https://www.youtube.com/watch?v=IO9XlQrEt2Y)

## Installation

```bash
pnpm i @3xpo/events
```

## Usage

```ts
import EventEmitter from '@3xpo/events'

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
