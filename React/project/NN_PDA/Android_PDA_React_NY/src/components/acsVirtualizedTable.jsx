import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import { Checkbox } from "@material-ui/core";
import { TransferWithinAStationOutlined } from "@material-ui/icons";

const styles = theme => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
    },
  },
  tableRow: {
    cursor: "pointer",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;

    if (columnIndex === 0) {
      return (
        <TableCell
          component='div'
          className={clsx(classes.tableCell, classes.flexContainer, {
            [classes.noClick]: onRowClick == null,
          })}
          variant='body'
          style={{ height: rowHeight }}>
          <Checkbox checked={this.props.isSelected(cellData)} />
        </TableCell>
      );
    } else {
      return (
        <TableCell
          component='div'
          className={clsx(classes.tableCell, classes.flexContainer, {
            [classes.noClick]: onRowClick == null,
          })}
          variant='body'
          style={{ height: rowHeight }}
          align={(columnIndex != null && columns[columnIndex].numeric) || false ? "right" : "left"}>
          {cellData}
        </TableCell>
      );
    }
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    if (columnIndex === 0) {
      return (
        <TableCell component='div' className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)} variant='head' style={{ height: headerHeight }} align={columns[columnIndex].numeric || false ? "right" : "left"}>
          <Checkbox onChange={this.props.handleAllClick} />
        </TableCell>
      );
    } else {
      return (
        <TableCell component='div' className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)} variant='head' style={{ height: headerHeight }} align={columns[columnIndex].numeric || false ? "right" : "left"}>
          <span>{label}</span>
        </TableCell>
      );
    }
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer disabledWidth>
        {({ height }) => (
          <Table
            height={height}
            width={1000}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}>
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---

export default function AcsVirtualizedTable({ data }) {
  const rows = data.map((data, i) => {
    return { id: i, ...data };
  });
  const columns = Object.keys(rows[0]).map(key => {
    return { width: 100, label: key, dataKey: key };
  });

  const [selected, setSelected] = useState([]);

  const isSelected = id => selected.indexOf(id) !== -1;

  const handleAllClick = e => {
    if (e.target.checked) {
      const newSelecteds = rows.map(row => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = e => {
    console.log(e);
    const selectedIndex = selected.indexOf(e.index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, e.index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  return (
    <Paper style={{ height: 300, width: "100%" }}>
      <VirtualizedTable //
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={columns}
        onRowClick={handleClick}
        handleAllClick={handleAllClick}
        isSelected={isSelected}
      />
    </Paper>
  );
}
