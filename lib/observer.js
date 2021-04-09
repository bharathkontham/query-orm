class Hooks {
  constructor () { this.queue = {}; }
  add (name, fn) {
    if (!this.queue[name]) {
      this.queue[name] = [];
    }
    this.queue[name].push(fn);
  };

  async execute (name, ...params) {
    if (this.queue[name]) {
      this.queue[name].forEach(fn => fn(...params));
      delete this.queue[name];
    }
  };
}

const validObservers = ['before save', 'after save', 'before delete', 'after delete'];

class Observer {
  constructor (modelName) {
    this.hooks = new Hooks();
    this.name = modelName;
  }

  observe (name, listner) {
    if (validObservers.indexOf(name) > -1) {
      this.hooks.add(this.name + ' ' + name, listner);
    } else {
      throw new Error('invalid observer!');
    }
  }

  async trigger (modelName, actionName, work, data) {
    const self = this;
    if (work) {
      if (modelName && actionName && this.hooks.queue[modelName + ' before ' + actionName]) {
        await this.hooks.execute(modelName + ' before ' + actionName, data);
        await work(next);
      } else {
        await work(next);
      }
    } else {
      throw new Error('work handler is reqired');
    }

    async function next (result) {
      if (modelName && actionName && self.hooks.queue[modelName + ' after ' + actionName]) {
        await self.hooks.execute(modelName + ' after ' + actionName, result);
        return result;
      } else {
        return result;
      }
    }
  }
}

module.exports = Observer;
