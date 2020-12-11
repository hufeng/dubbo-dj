# dj

A dsl tool that generates dubbo code

# getting started

### installation

```sh
npm i -g @dubbo/dj
```

### command

```txt
> djc
Usage: dj [options]

A dsl tool that generates dubbo code ❤️

Options:
  -V, --version   output the version number
  -i, --init      init dubbo dsl project in current dir
  -b, --build     support generate language such as java, go, ts (default: "ts")
  -h, --help      display help for command
```

### build api

```typescript
import { djc } from '@dubbo/dj'
import * as entity from './entity'
import * as service from './service'

djc({
  buildEntry: { entity, service },
  config: {
    lang: ['ts'], // 可选值（支持多选）， ts, go, java
    type: ['service'], // 可选值（支持多选）， entity, consumer, service, serviceImpl
  },
})
```
