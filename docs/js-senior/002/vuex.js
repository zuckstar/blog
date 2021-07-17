class Vuex {
  state = {}
  action = {}

  _actionSubscribers = []

  constructor({ state, action }) {
    this.state = state
    this.action = action
    this._actionSubscribers = []
  }

  dispatch (action) {
    // action 前置监听器
    this._actionSubscribers.forEach(sub => sub.before(action, this.state))
    
    const { type, payload } = action

    this.action[type](this.state, payload).then(() => {
      // action 后置监听器
      this._actionSubscribers.forEach(sub => sub.after(action, this.state))
    })
  }

subscribeAction (subscriber) {
    this._actionSubscribers.push(subscriber)
  }
}

const store = new Vuex({
  state: {
    count: 0
  },
  action: {
    async add (state, payload) {
      state.count += payload
    }
  }
})

store.subscribeAction({
  before: (action, state) => {
    console.log(`before action ${action.type}, before count is ${state.count}`);
  },
  after: (action, state) => {
    console.log(`after action ${action.type},  after count is ${state.count}`);
  }
})

store.dispatch({
  type: "add",
  payload: 2
});