import React, { useEffect, useState } from "react";
import { AutoSizer, Grid, GridCellProps, MultiGrid } from "react-virtualized";
import cx from "classnames";
import { flow } from "mobx";
import axios from "axios";

export function AdminApp() {
  return (
    <div className="adminApp">
      <UsersScreen />
    </div>
  );
}

export function Screen(props: { header?: React.ReactNode; actions?: React.ReactNode; content?: React.ReactNode }) {
  return (
    <div className="adminScreen">
      <div className="adminScreen__header">{props.header}</div>
      <div className="adminScreen__actions">{props.actions}</div>
      <div className="adminScreen__content">{props.content}</div>
    </div>
  );
}

export function UsersScreen() {
  return <Screen content={<UsersTable />} />;
}

export function ChatroomsScreen() {}

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    flow(function* () {
      const users = yield axios.get("http://localhost:9099/adminApi/users");
      setUsers(users.data);
    })();
  }, []);

  const columns = [
    {field: 'id'},
    {field: 'firstName'},
    {field: 'lastName'},
  ]

  return (
    <Table
      rowCount={users.length}
      renderHeader={(columnIndex) => <>{columns[columnIndex].field}</>}
      renderCell={(rowIndex, columnIndex) => (
        <>
          {users[rowIndex][columns[columnIndex].field]}
        </>
      )}
    />
  );
}

function Table(props: {
  rowCount: number;
  renderHeader(columnIndex: number): React.ReactNode;
  renderCell(rowIndex: number, columnIndex: number): React.ReactNode;
}) {
  const renderCell = (columnCount: number) => (args: GridCellProps) => {
    return (
      <div
        style={args.style}
        key={args.key}
        className={cx("dataCell", {
          header: args.rowIndex === 0,
          row0: args.rowIndex % 2 === 0 && args.rowIndex > 0,
          row1: args.rowIndex % 2 === 1 && args.rowIndex > 0,
        })}
      >
        {args.columnIndex !== columnCount ? (
          <>
            {args.rowIndex > 0
              ? props.renderCell(args.rowIndex - 1, args.columnIndex)
              : props.renderHeader(args.columnIndex)}
          </>
        ) : null}
      </div>
    );
  };

  const itemCount = props.rowCount;
  const columnCount = 3;
  const columnSizes = [300, 150, 150];
  const columnSizesSum = columnSizes.reduce((acc, a) => acc + a, 0);
  return (
    <AutoSizer>
      {({ width, height }) => {
        const displayFillers = columnSizesSum < width;
        return (
          <MultiGrid
            width={width}
            height={height}
            rowCount={itemCount + 1}
            fixedRowCount={1}
            columnCount={displayFillers ? columnCount + 1 : columnCount}
            rowHeight={30}
            columnWidth={({ index }) => {
              if (index < columnCount) {
                return columnSizes[index];
              } else if (displayFillers) {
                return width - columnSizesSum;
              } else return 0;
            }}
            cellRenderer={renderCell(columnCount)}
          />
        );
      }}
    </AutoSizer>
  );
}
