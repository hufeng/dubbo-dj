/**
 * auto generated by dubbo dj
 * ~~~ 💗 machine coding 💗 ~~~
 */

import java from 'js-to-java'

export interface IAddress {
  province: string

  city: string
}

export class Address {
  province: string

  city: string

  constructor(props: IAddress) {
    this.province = props.province
    this.city = props.city
  }

  __fields2java() {
    return java('org.apache.dubbo.entity.Address', {
      province: java.String(this.province),
      city: java.String(this.city),
    })
  }
}