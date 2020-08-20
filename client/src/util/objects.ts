export function wrapNullObject(wrapped: any) {
  const warned = new Set<any>();

  function warnAccess(prop: any) {
    if (!warned.has(prop)) {
      console.warn(`Accessed ${prop} of NullObject!`);
      warned.add(prop);
    }
  }

  return new Proxy(wrapped, {
    get(target, prop, receiver) {
      warnAccess(prop);
      return target[prop];
    },
    set(target, prop, value, receiver) {
      warnAccess(prop);
      target[prop] = value;
      return true;
    },
  });
}