class EventEmitter {
  constructor() {
    this.all = new Map()
  }

  on(type, handler) {
    const handlers = this.all.get(type)
    if (handlers) {
      handlers.push(handler)
    } else {
      this.all.set(type, [handler])
    }
  }

  off(type, handler) {
    const handlers = this.all.get(type)
    if (handlers) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler), 1)
      } else {
        this.all.set(type, [])
      }
    }
  }

  emit(type, evt) {
    const handlers = all.get(type)
    if (handlers) {
      handlers.slice().map((handler) => handler(evt))
    }
  }
}
