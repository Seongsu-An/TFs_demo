import { inject } from 'vue'

const injectionKey = Symbol('GlobalInjection')

const isEmpty = (target) => {
  if (target === undefined || target == null) return true
  if (typeof target == 'string' && target.trim().length == 0) return true
  if (Array.isArray(target) && target.length == 0) return true
  return false
}

const nvl = (target, value) => {
  return isEmpty(target) ? value : target
}

const typeOf = (data) => {
  return Object.prototype.toString.call(data).match(/([\w]+)\]/)[1]
}

export const global = {
  install(app) {
    const globalValue = {
      $isEmpty: isEmpty,
      $nvl: nvl,
      $typeof: typeOf
    }

    app.provide(injectionKey, globalValue)
  }
}

export const useGlobal = () => {
  return inject(injectionKey)
}
