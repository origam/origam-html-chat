import React from "react";
import "./index.scss";
import { CtxHashtagRootStore } from "./components/Common";
import { HashtagDialogContent } from "./components/HashtagDialog";
import {
  Column,
  Column2TouchMoveControlee,
  DataSource,
  DataSourceField,
  DataTable,
} from "./stores/DataTableStore";
import { HashtagRootStore } from "./stores/RootStore";
import { ObjectTouchMover } from "./util/ObjectTouchMover";

import faker from "faker";
import { TableCursor } from "./stores/TableCursorStore";
import {
  DefaultModal,
  ModalCloseButton,
  ModalFooter,
} from "../../components/Windows/Windows";
import { Button } from "../../components/Buttons";
import { Observer } from "mobx-react";
faker.seed(987);

export function capitalize(sin: string) {
  return sin.charAt(0).toUpperCase() + sin.slice(1);
}

export function populateHashtaggingStore(rootStore: HashtagRootStore) {
  function makeObjectsTable() {
    const dataTable = new DataTable(new TableCursor(), "objects", 0);
    const columns = [
      new Column(dataTable, "firstName", "First name", "text"),
      new Column(dataTable, "lastName", "Last name", "text"),
      new Column(dataTable, "city", "City", "text"),
      new Column(dataTable, "dateOfBirth", "Birth date", "text"),
      new Column(
        dataTable,
        "transactionCount",
        "Number of transactions",
        "number"
      ),
    ];
    columns[3].width = 250;

    for (let c of columns) {
      c.touchMover = new ObjectTouchMover(new Column2TouchMoveControlee(c));
    }

    dataTable.columns.push(...columns);
    const dataSource = new DataSource("objects");
    const dataSourceFields = [
      new DataSourceField("id", 0),
      new DataSourceField("firstName", 1),
      new DataSourceField("lastName", 2),
      new DataSourceField("city", 3),
      new DataSourceField("dateOfBirth", 4),
      new DataSourceField("transactionCount", 5),
      new DataSourceField("refCategoryId", 6),
    ];
    dataSource.fields.push(...dataSourceFields);
    dataTable.dataSource = dataSource;

    /*for (let i = 0; i < 1000; i++) {
    dataTable.rows.push([
      `id-obj-${i}`,
      faker.name.firstName(),
      faker.name.lastName(),
      faker.address.city(),
      faker.date.past().toString(),
      faker.random.number(500),
    ]);
  }*/

    return dataTable;
  }

  const dtObjects = makeObjectsTable();

  function makeCategoriesTable() {
    const dataTable = new DataTable(new TableCursor(), "categories", 0);
    const columns = [new Column(dataTable, "name", "Name", "text")];

    columns[0].touchMover = new ObjectTouchMover(
      new Column2TouchMoveControlee(columns[0])
    );

    dataTable.columns.push(...columns);
    const dataSource = new DataSource("categories");
    const dataSourceFields = [
      new DataSourceField("id", 0),
      new DataSourceField("name", 1),
    ];
    dataSource.fields.push(...dataSourceFields);
    dataTable.dataSource = dataSource;
    /*for (let i = 0; i < 50; i++) {
    dataTable.rows.push([`id-cat-${i}`, capitalize(faker.random.word())]);
  }*/
    return dataTable;
  }

  const dtCategories = makeCategoriesTable();

  rootStore.dataTableStore.dataTables.push(dtObjects, dtCategories);
}

export function renderHashtaggingDialog() {
  return (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button onClick={undefined}>Ok</Button>
          <Button onClick={undefined}>Cancel</Button>
        </ModalFooter>
      }
    >
      <ModalCloseButton onClick={undefined} />
      <div className="hashtaggingDialogContainer">
        <HashtagDialogContent />
      </div>
    </DefaultModal>
  );
}
