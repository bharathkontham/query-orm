class Hooks {
  constructor() {}
  queue = {};
  add = function (name, fn) {
    if (!this.queue[name]) {
      this.queue[name] = [];
    }
    this.queue[name].push(fn);
  };
  call = async function (name, ...params) {
    if (this.queue[name]) {
      this.queue[name].forEach(fn => fn(...params));
      delete this.queue[name];
    }
  };

}

const validObservers = ['before save', 'after save', 'before delete', 'after delete'];

/*
  //create
  Model.observe('before save', (instance) => {
    instance.foo = 'bar1';
    return Promise.resolve();
  })

  //update
  Model.observe('before save', (data) => {
    // data.id, data.attributes, data.where are available w.r.t method
    return Promise.resolve();
  })

  Model.observe('after save', (result) => {
    return Promise.resolve();
  })

  Model.observe('before delete', (data) => {
    // data.id, data.attributes, data.where are available w.r.t method
    return Promise.resolve();
  })

  Model.observe('after delete', (result) => {
    return Promise.resolve();
  })

*/

class Observer {
  constructor(modelName) {
    this.hooks = new Hooks();
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