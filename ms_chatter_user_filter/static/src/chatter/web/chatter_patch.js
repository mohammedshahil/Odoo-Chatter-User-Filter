/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Chatter } from "@mail/chatter/web_portal/chatter";

patch(Chatter.prototype, {
  setup() {
    super.setup(...arguments);
    this.state.selectedUserName = null;
  },

  get uniqueMessageAuthors() {
    if (!this.state.thread?.messages) {
      return [];
    }

    const authorMap = new Map();
    this.state.thread.messages.forEach((message) => {
      if (message.author) {
        authorMap.set(message.author.id, {
          id: message.author.id,
          name: message.author.name,
        });
      }
    });

    return Array.from(authorMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  },

  get threadForRender() {
    const thread = this.state.thread;
    if (!thread) {
      return thread;
    }
    const selectedUserName = this.state.selectedUserName;
    return new Proxy(thread, {
      get(target, prop, receiver) {
        if (prop === "messages" && selectedUserName) {
          const messages = Reflect.get(target, prop, receiver);
          // Return a proxy for the messages array to filter it on the fly
          return new Proxy(messages, {
            get(target, prop, receiver) {
              if (prop === "filter") {
                // Ensure our filter is always applied first
                return (callback, thisArg) => {
                  const filtered = target.filter(
                    (m) => m.author?.name === selectedUserName
                  );
                  return filtered.filter(callback, thisArg);
                };
              }
              if (prop === Symbol.iterator) {
                return target
                  .filter((m) => m.author?.name === selectedUserName)
                  [Symbol.iterator].bind(
                    target.filter((m) => m.author?.name === selectedUserName)
                  );
              }
              if (prop === "length") {
                return target.filter((m) => m.author?.name === selectedUserName)
                  .length;
              }
              if (!isNaN(prop)) {
                return target.filter(
                  (m) => m.author?.name === selectedUserName
                )[prop];
              }
              return Reflect.get(target, prop, receiver);
            },
          });
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  },

  filterByUser(userName) {
    this.state.selectedUserName = userName;
    this.render();
  },
});
