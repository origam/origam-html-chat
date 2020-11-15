import faker from "faker";

faker.seed(9876)

export class PubSub {
  reg = new Map<number, any>();
  idGen = 0;

  subs(handler: (...args: any) => void) {
    const myId = this.idGen++;
    this.reg.set(myId, handler);
    return () => this.reg.delete(myId);
  }

  trig(...args: any) {
    for (let h of this.reg.values()) h();
  }
}

export function delay(ms: number, chCancel?: PubSub) {
  return new Promise((resolve) => {
    const hTimer = setTimeout(() => {
      hCancel?.();
      resolve();
    }, ms);
    const hCancel = chCancel?.subs(() => {
      clearTimeout(hTimer);
      hCancel?.();
    });
  });
}

export function capitalize(sin: string) {
  return sin.charAt(0).toUpperCase() + sin.slice(1);
}

function makeCategories() {
  const result: any[][] = [];
  for (let i = 0; i < 50; i++) {
    result.push([`id-cat-${i}`, capitalize(faker.random.word())]);
  }
  return result;
}

function makeObjects() {
  const result: any[][] = [];
  for (let i = 0; i < 1000; i++) {
    result.push([
      `id-obj-${i}`,
      faker.name.firstName(),
      faker.name.lastName(),
      faker.address.city(),
      faker.date.past().toString(),
      faker.random.number(500),
      `id-cat-${(Math.random()*50).toFixed(0)}`
    ]);
  }
  return result;
}

const categories = makeCategories();
const objects = makeObjects();

export class APIService {
  async getCategories(
    searchTerm: string,
    offset: number,
    limit: number,
    chCancel?: PubSub
  ): Promise<any> {
    console.log("getCategories", searchTerm);
    await delay(250, chCancel);
    const filt = categories.filter((item) => {
      if (!searchTerm) return true;
      return (item[1] || "")
        .toLocaleLowerCase()
        .includes((searchTerm || "").toLocaleLowerCase());
    });
    return filt.slice(offset, offset + limit);
  }

  async getObjects(
    categoryId: string,
    searchTerm: string,
    offset: number,
    limit: number,
    chCancel?: PubSub
  ): Promise<any> {
    console.log("getObjects", categoryId, searchTerm);
    await delay(300, chCancel);
    const filt = objects
      .filter((item) => !categoryId || item[6] === categoryId)
      .filter((item) => {
        if (!searchTerm) return true;
        return (
          (item[1] || "")
            .toLocaleLowerCase?.()
            .includes((searchTerm || "").toLocaleLowerCase?.()) ||
          (item[2] || "")
            .toLocaleLowerCase?.()
            .includes((searchTerm || "").toLocaleLowerCase?.()) ||
          (item[3] || "")
            .toLocaleLowerCase?.()
            .includes((searchTerm || "").toLocaleLowerCase?.()) ||
          (item[4] || "")
            .toLocaleLowerCase?.()
            .includes((searchTerm || "").toLocaleLowerCase?.()) ||
          (item[5] || "")
            .toLocaleLowerCase?.()
            .includes((searchTerm || "").toLocaleLowerCase?.())
        );
      });
    return filt.slice(offset, offset + limit);
  }
}
