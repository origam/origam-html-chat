import React, { useEffect, useRef } from "react";
import cx from "classnames";
import { AutoSizer, MultiGrid } from "react-virtualized";
import { useRootStore } from "./Common";
import { useDataTable, useEntityId } from "./DataTableCommon";
import { observer, Observer } from "mobx-react";
import { reaction } from "mobx";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { flf2mof } from "../../../../util/convert";


function renderSelectionCheckbox(args: {
  key: any;
  style: any;
  rowIndex: number;
  columnIndex: number;
}) {
  return (
    <SelectionCell
      key={args.key}
      style={args.style}
      rowIndex={args.rowIndex}
      columnIndex={args.columnIndex}
    />
  );
}

function renderObjectTableCell(args: {
  key: any;
  style: any;
  rowIndex: number;
  columnIndex: number;
}) {
  if (args.columnIndex === 0) return renderSelectionCheckbox(args);
  const isHeader = args.rowIndex === 0;
  const dataColumnIndex = args.columnIndex - 1;
  const dataRowIndex = args.rowIndex - 1;
  if (isHeader) {
    return (
      <HeaderCell
        key={args.key}
        style={args.style}
        columnIndex={dataColumnIndex}
      />
    );
  } else {
    return (
      <DataCell
        key={args.key}
        style={args.style}
        rowIndex={dataRowIndex}
        columnIndex={dataColumnIndex}
      />
    );
  }
}

function useDataCell(rowIndex: number, columnIndex: number) {
  const dataTable = useDataTable();
  const cursor = dataTable?.tableCursor;
  const column = dataTable?.getColumnByDataCellIndex(columnIndex);
  const row = dataTable?.getRowByDataCellIndex(rowIndex);
  return {
    renderer: column?.renderer,
    formatterPattern: column?.formatterPattern,
    value:
      column?.dataIndex !== undefined ? row?.[column?.dataIndex] : undefined,
    isLastColumn:
      dataTable?.columnCount !== undefined
        ? columnIndex === dataTable?.columnCount - 1
        : false,
    isSelectedRow:
      row &&
      dataTable &&
      cursor &&
      dataTable?.getRowId(row) === cursor?.selectedRowId,
    handleClick: (event: any) =>
      dataTable?.handleDataCellClick(event, rowIndex, columnIndex),
  };
}

function useSelectionCell(rowIndex: number) {
  const dataTable = useDataTable();
  const cursor = dataTable?.tableCursor;
  const row = dataTable?.getRowByDataCellIndex(rowIndex);
  const rowId = row ? dataTable?.getRowId(row) : undefined;
  return {
    handleSelectionChange: (event: any) =>
      rowId &&
      dataTable?.handleSelectionChange(event, rowId, event.target.checked),
    isSelectedRow:
      row &&
      dataTable &&
      cursor &&
      dataTable?.getRowId(row) === cursor?.selectedRowId,
    get value() {
      return dataTable?.getSelectionStateByRowId(rowId) || false;
    },
    handleClick: (event: any) =>
      dataTable?.handleSelectionCellClick(event, rowIndex),
  };
}

function useHeaderCell(columnIndex: number) {
  const dataTable = useDataTable();
  const column = dataTable?.getColumnByDataCellIndex(columnIndex);
  const touchMover = column?.touchMover;

  return {
    name: column?.name,
    handlePointerDown: touchMover?.handlePointerDown,
    isLastColumn:
      dataTable?.columnCount !== undefined
        ? columnIndex === dataTable?.columnCount - 1
        : false,
  };
}

const DataCell = observer(function DataCell(props: {
  rowIndex: number;
  columnIndex: number;
  style: any;
}) {
  const rootStore = useRootStore();
  const { spObjects } = rootStore.searchStore;
  const {
    renderer,
    formatterPattern,
    value,
    isLastColumn,
    isSelectedRow,
    handleClick,
  } = useDataCell(props.rowIndex, props.columnIndex);
  let txtValue = value;
  switch (renderer) {
    case "Date": {
      const momentDate = moment(txtValue);
      txtValue = momentDate.format(flf2mof(formatterPattern || ""));
      break;
    }
  }
  let rui = <></>;
  if (spObjects) {
    rui = (
      <Highlighter searchWords={[spObjects]} textToHighlight={`${txtValue}`} />
    );
  } else {
    rui = <>{txtValue}</>;
  }
  rui = (
    <div
      style={props.style}
      className={cx("dataTable__dataCell", {
        c0: props.rowIndex % 2 === 0,
        c1: props.rowIndex % 2 === 1,
        cl: isLastColumn,
        isSelectedRow,
      })}
      onClick={handleClick}
    >
      {rui}
    </div>
  );

  return rui;
});

const SelectionCell = observer(function SelectionCell(props: {
  rowIndex: number;
  columnIndex: number;
  style: any;
}) {
  const rowSelectionCell = useSelectionCell(props.rowIndex - 1);
  const isHeader = props.rowIndex === 0;
  return (
    <div
      style={props.style}
      className={cx(
        {
          dataTable__headerCell: isHeader,
          dataTable__dataCell: !isHeader,
          isSelectedRow: rowSelectionCell.isSelectedRow,
        },
        "selectionCheckbox"
      )}
      onClick={rowSelectionCell.handleClick}
    >
      {!isHeader && (
        <input
          type="checkbox"
          checked={rowSelectionCell.value}
          onChange={rowSelectionCell.handleSelectionChange}
        />
      )}
    </div>
  );
});

const HeaderCell = observer(function HeaderCell(props: {
  columnIndex: number;
  style: any;
}) {
  const { name, isLastColumn, handlePointerDown } = useHeaderCell(
    props.columnIndex
  );
  return (
    <div
      style={props.style}
      className={cx("dataTable__headerCell", {
        cl: isLastColumn,
      })}
    >
      {name}
      <div className="columnWidthHandle" onMouseDown={handlePointerDown} />
    </div>
  );
});

export const ObjectTable = observer(function CategoryTable() {
  const root = useRootStore();
  const dataTable = useDataTable();
  const refGrid = useRef<any>();
  const columnCount = (dataTable?.columnCount || 0) + 1;
  const getColumnWidth = (args: { index: number }) =>
    (args.index === 0
      ? 25
      : dataTable?.getColumnByDataCellIndex(args.index - 1)?.width) || 250;

  const rowCount = (dataTable?.rowCount || 0) + 1;

  useEffect(() => {
    return reaction(
      () => {
        for (let i = 0; i < columnCount; i++) {
          getColumnWidth({ index: i });
        }
        return [];
      },
      () => {
        refGrid.current?.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
      },
      { scheduler: requestAnimationFrame }
    );
  }, [getColumnWidth]);
  const ROW_HEIGHT = 25;
  function handleScroll(event: any) {
    if (
      event.scrollHeight - event.scrollTop - event.clientHeight <
      ROW_HEIGHT * 100
    ) {
      root.screenProcess.handleScrolledNearTableEnd();
    }
  }
  return (
    <AutoSizer>
      {({ width, height }) => (
        <Observer>
          {() => {
            // TODO :-/

            return (
              <MultiGrid
                ref={refGrid}
                cellRenderer={renderObjectTableCell}
                rowCount={rowCount}
                columnCount={columnCount}
                rowHeight={ROW_HEIGHT}
                columnWidth={getColumnWidth}
                fixedRowCount={1}
                width={width}
                height={height}
                onScroll={handleScroll}
                classNameTopRightGrid="dataTable__headerRow"
              />
            );
          }}
        </Observer>
      )}
    </AutoSizer>
  );
});
