const hooks = {
  queue: {},
  add: function (name, fn) {
    if (!hooks.queue[name]) {
      hooks.queue[name] = [];
    }
    hooks.queue[name].push(fn);
  },
  call: async function (name, ...params) {
    if (hooks.queue[name]) {
      hooks.queue[name].forEach(fn => fn(...params));
      delete hooks.queue[name];
    }
  }
}

const validObservers = ['before save', 'after save', 'before delete', 'after delete'];

/*

  Model.observe('before save', (instance) => {
    instance.foo = 'bar1';
    return Promise.resolve();
  })

*/

class Observer {
  constructor(modelName) {
    this.hooks = hooks;
    this.name = modelName;
  }

  observe(name, listner) {
    if (validObservers.indexOf(name) > -1) {
      this.hooks.add(this.name + ' ' + name, listner);
    } else {
      throw new Error('invalid observer!')
    }
  }
  trigger = async (modelName, actionName, work, data) => {
    const self = this;
    if (work) {
      if (modelName && actionName && this.hooks.queue[modelName + ' before ' + actionName]) {
        await this.hooks.call(modelName + ' before ' + actionName, data);
        await work(next);
      } else {
        await work(next);
      }
    } else {
      throw new Error('work handler is reqired');
    }

    async function next(result) {
      if (modelName && actionName && self.hooks.queue[modelName + ' after ' + actionName]) {
        await self.hooks.call(modelName + ' after ' + actionName, result)
        return result;
      } else {
        return result;
      }
    }
  }

}

module.exports = Observer;
