import _ from "lodash";
import { createMachine, interpret, Interpreter } from "xstate";
import { APIService, PubSub } from "./APIService";

import { inspect } from "@xstate/inspect";
import { HashtagRootStore } from "../stores/RootStore";
import { WindowsSvc } from "../../../components/Windows/WindowsSvc";
import { renderHashtaggingDialog } from "../HashtaggingApp";

/*inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});*/

export class ScreenProcess {
  constructor(
    public root: HashtagRootStore,
    public apiService: APIService,
    public windowsSvc: WindowsSvc
  ) {}

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
            invoke: {
              src: "svcHashtagDialog",
            },
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
                onExit: ["actFixCategorySelection"],
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
              .then((items) => {
                this.root.dataTableStore
                  .getDataTable("objects")
                  ?.setRows(items);
                callback("DONE");
              });
            return () => chCancel.trig();
          },
          svcHashtagDialog: (ctx, event) => (callback, onReceive) => {
            this.windowsSvc.push(() => renderHashtaggingDialog() )
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

  handleCategorySearchChange = _.throttle(
    this.handleCategorySearchChangeImm,
    100
  );

  handleObjectSearchChangeImm(value: string) {
    this.interpreter?.send("SEARCH_OBJECT_CHANGED");
  }

  handleObjectSearchChange = _.throttle(this.handleObjectSearchChangeImm, 100);

  handleSelectedCategoryChangeImm(rowId: string) {
    this.interpreter?.send("SELECTED_CATEGORY_CHANGED");
  }

  handleSelectedCategoryChange = _.throttle(
    this.handleSelectedCategoryChangeImm,
    100
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
