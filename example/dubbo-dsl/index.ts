import { djc } from '@dubbo/dj'
import * as entity from './entity'
import * as service from './service'

djc({
  buildEntry: { entity, service },
})
