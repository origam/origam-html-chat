import faker from "faker";
import { ChatHTTPApi } from "../../../services/ChatHTTPApi";
import { HashtagRootStore } from "../stores/RootStore";
import xmlJs from "xml-js";

faker.seed(9876);

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
  return new Promise<void>((resolve) => {
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
      `id-cat-${(Math.random() * 50).toFixed(0)}`,
    ]);
  }
  return result;
}

const categories = makeCategories();
const objects = makeObjects();

export class APIService {
  constructor(public rootStore: HashtagRootStore) {}

  get api() {
    return this.rootStore.httpApi;
  }

  async getCategories(
    searchTerm: string,
    offset: number,
    limit: number,
    chCancel?: PubSub
  ): Promise<any> {
    /* console.log(await this.api.getHashtagCategories());
    console.log("getCategories", searchTerm);
    await delay(250, chCancel);
    const filt = categories.filter((item) => {
      if (!searchTerm) return true;
      return (item[1] || "")
        .toLocaleLowerCase()
        .includes((searchTerm || "").toLocaleLowerCase());
    });
    return filt.slice(offset, offset + limit);*/
    const categories = await this.api.getHashtagAvailableCategories();
    function transformCombo(combo: any) {
      const control = combo?.elements?.[0];
      const controlColumns = control?.elements?.[0]?.elements;
      if (control && controlColumns) {
        const identifierIndex = parseInt(control.attributes.IdentifierIndex);
        const tableConfig = {
          identifierIndex,
          columns: controlColumns.map((ccol: any) => {
            return {
              type: ccol.attributes.Column,
              formatterPattern: ccol.attributes.FormatterPattern,
              label: ccol.attributes.Name,
              name: ccol.attributes.Id,
            };
          }),
          dataSourceFields: [
            { name: "$Id", dataIndex: identifierIndex },
            ...controlColumns.map((ccol: any) => {
              return {
                name: ccol.attributes.Id,
                dataIndex: parseInt(ccol.attributes.Index),
              };
            }),
          ],
        };
        return tableConfig;
      }
    }
    return categories.map((item: any) => {
      return [
        item.deepLinkName,
        item.deepLinkLabel,
        transformCombo(xmlJs.xml2js(item.objectComboboxMetadata)),
      ];
    });
  }

  async getObjects(
    categoryId: string,
    searchTerm: string,
    pageNumber: number,
    pageSize: number,
    chCancel?: PubSub
  ): Promise<any> {
    return await this.api.getHashtagAvailableObjects(
      categoryId,
      pageNumber,
      pageSize,
      searchTerm || undefined,
      chCancel
    );
  }

  async getHashtagLabels(categoryId: string, labelIds: string[]) {
    return await this.api.getHashtagLabels(categoryId, labelIds);
  }
}
