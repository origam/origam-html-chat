import _ from "lodash";
import { createMachine, interpret, Interpreter } from "xstate";
import { APIService, PubSub } from "./APIService";

import { inspect } from "@xstate/inspect";
import { HashtagRootStore } from "../stores/RootStore";
import { WindowsSvc } from "../../../components/Windows/WindowsSvc";
import { renderHashtaggingDialog } from "../HashtaggingApp";
import { action, reaction, runInAction, toJS } from "mobx";
import {
  Column,
  Column2TouchMoveControlee,
  DataSourceField,
} from "../stores/DataTableStore";
import { ObjectTouchMover } from "../util/ObjectTouchMover";

/*inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});*/

export class ScreenProcess {
  constructor(public root: HashtagRootStore, public windowsSvc: WindowsSvc) {}

  get apiService() {
    return this.root.apiService;
  }

  get dataTableCategories() {
    return this.root.dataTableStore.getDataTable("categories");
  }

  get dataTableObjects() {
    return this.root.dataTableStore.getDataTable("objects");
  }

  interpreter?: Interpreter<any>;

  start() {
    this.interpreter = interpret(this.createMachine(), { devTools: true });
    this.interpreter.onTransition((state, event) => {
      console.log("TRANSITION", event, state);
    });
    this.interpreter.start();
  }

  createMachine() {
    return createMachine(
      {
        id: "screenProcess",
        initial: "DIALOG_DISPLAYED",
        states: {
          DIALOG_DISPLAYED: {
            invoke: [
              {
                src: "svcHashtagDialog",
              },
              {
                src: "svcReactions",
              },
            ],
            initial: "LOAD_CATEGORIES",
            states: {
              LOAD_CATEGORIES: {
                invoke: {
                  src: "svcLoadCategories",
                },
                on: {
                  SEARCH_CATEGORY_CHANGED: {
                    target: "LOAD_CATEGORIES",
                  },
                  DONE: {
                    target: "LOAD_OBJECTS",
                  },
                },
                onExit: [
                  "actFixCategorySelection",
                  "actSelectedCategoryChanged",
                ],
              },
              LOAD_OBJECTS: {
                invoke: {
                  src: "svcLoadObjects",
                },
                on: {
                  SEARCH_OBJECT_CHANGED: {
                    target: "LOAD_OBJECTS",
                  },
                  SEARCH_CATEGORY_CHANGED: {
                    target: "LOAD_CATEGORIES",
                  },
                  SELECTED_CATEGORY_CHANGED: {
                    target: "LOAD_OBJECTS",
                    actions: ["actSelectedCategoryChanged"],
                  },
                  DONE: {
                    target: "IDLE",
                  },
                },
                onExit: ["actFixObjectSelection"],
              },
              IDLE: {
                on: {
                  SEARCH_OBJECT_CHANGED: {
                    target: "LOAD_OBJECTS",
                  },
                  SEARCH_CATEGORY_CHANGED: {
                    target: "LOAD_CATEGORIES",
                  },
                  SELECTED_CATEGORY_CHANGED: {
                    target: "LOAD_OBJECTS",
                    actions: ["actSelectedCategoryChanged"],
                  },
                },
              },
            },
          },
        },
      },
      {
        actions: {
          actFixCategorySelection: (ctx, event) => {
            const dataTable = this.root.dataTableStore.getDataTable(
              "categories"
            );
            if (
              dataTable &&
              dataTable?.rowCount > 0 &&
              !dataTable?.selectedRow
            ) {
              dataTable.tableCursor.setSelectedRowId(
                dataTable.getRowId(dataTable.getRowByDataCellIndex(0))
              );
            }
          },
          actSelectedCategoryChanged: (ctx, event) => {
            runInAction(() => {
              const choosenCategoryRow = this.dataTableCategories?.selectedRow;
              console.log(choosenCategoryRow);
              if (
                choosenCategoryRow &&
                this.dataTableObjects &&
                this.dataTableCategories
              ) {
                const tableConfig = choosenCategoryRow[2];
                console.log(toJS(tableConfig));
                this.dataTableObjects.dataSource.clearFields();
                this.dataTableObjects.dataSource.fields.push(
                  ...tableConfig.dataSourceFields.map(
                    (item: any) =>
                      new DataSourceField(item.name, item.dataIndex)
                  )
                );
                this.dataTableObjects.clearColumns();
                this.dataTableObjects.columns.push(
                  ...tableConfig.columns.map(
                    (item: any) =>
                      new Column(
                        this.dataTableObjects!,
                        item.name,
                        item.label,
                        item.type
                      )
                  )
                );
                for (let c of this.dataTableObjects.columns) {
                  c.touchMover = new ObjectTouchMover(
                    new Column2TouchMoveControlee(c)
                  );
                }
              }
            });
          },
          /*actFixObjectSelection: (ctx, event) => {
          const dataTable = this.root.dataTableStore.getDataTable("objects");
          if (dataTable && dataTable?.rowCount > 0 && !dataTable?.selectedRow) {
            dataTable.tableCursor.setSelectedRowId(
              dataTable.getRowId(dataTable.getRowByDataCellIndex(0))
            );
          }
        },*/
        },
        services: {
          svcLoadCategories: (ctx, event) => (callback, onReceive) => {
            const chCancel = new PubSub();
            this.apiService
              .getCategories(this.categorySearchTerm, 0, 1000, chCancel)
              .then((items) => {
                this.root.dataTableStore
                  .getDataTable("categories")
                  ?.setRows(items);
                callback("DONE");
              });
            return () => chCancel.trig();
          },
          svcLoadObjects: (ctx, event) => (callback, onReceive) => {
            const chCancel = new PubSub();
            this.apiService
              .getObjects(
                this.selectedCategoryId || "",
                this.objectSearchTerm,
                0,
                1000,
                chCancel
              )
              .then(
                action((items) => {
                  const value = items.Value.map((item: any, idx: number) => [
                    `id-${idx}`,
                    ...item,
                  ]);
                  this.root.dataTableStore
                    .getDataTable("objects")
                    ?.setRows(value);
                  callback("DONE");
                })
              )
              .catch((e) => {
                if (e.$isCancellation) return;
                throw e;
              });
            return () => chCancel.trig();
          },
          svcHashtagDialog: (ctx, event) => (callback, onReceive) => {
            this.windowsSvc.push(() => renderHashtaggingDialog());
          },
          svcReactions: (ctx, event) => (callback, onReceive) => {
            const _disposers: any[] = [];
            return () => {
              for (let h of _disposers) h();
            };
          },
        },
      }
    );
  }

  handleUIInitialized() {
    this.interpreter?.send("UI_INITIALIZED");
  }

  handleCategorySearchChangeImm(value: string) {
    this.interpreter?.send("SEARCH_CATEGORY_CHANGED");
  }

  handleCategorySearchChange = _.debounce(
    this.handleCategorySearchChangeImm,
    400
  );

  handleObjectSearchChangeImm(value: string) {
    this.interpreter?.send("SEARCH_OBJECT_CHANGED");
  }

  handleObjectSearchChange = _.debounce(this.handleObjectSearchChangeImm, 400);

  handleSelectedCategoryChangeImm(rowId: string) {
    this.interpreter?.send("SELECTED_CATEGORY_CHANGED");
  }

  handleSelectedCategoryChange = _.debounce(
    this.handleSelectedCategoryChangeImm,
    400
  );

  get selectedCategoryId() {
    return this.root.dataTableStore.getDataTable("categories")?.tableCursor
      .selectedRowId;
  }

  get categorySearchTerm() {
    return this.root.searchStore.spCategories;
  }

  get objectSearchTerm() {
    return this.root.searchStore.spObjects;
  }
}
