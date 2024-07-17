import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import { useState } from 'react';

function AcsDataGrid({width, height, rows, cols, ...props}) {
  const changedcols = cols.map((column) => ({
        ...column,
        sortable: false,
        }));
  const [pageSize, setPageSize] = useState(100); // Data Grid 페이지 row 개수

  const handlePageSizeChange = (e) => {
    setPageSize(e.pageSize);
  };

  return (
    <div style={{ height: height, width: width }}>
      <DataGrid
        rows={rows}
        columns={changedcols}
        density="compact"
        //hideFooter={true}
        disableColumnMenu={true}
        hideFooter={rows.length >= 2 ? false : true}
        pageSize={pageSize}
        rowsPerPageOptions={[25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
        {...props}
      />
    </div>
  );
}

AcsDataGrid.defaultProps = {
    height: 300, 
    width: "100%",
}

// AcsDataGrid.propTypes ={
//     rows: PropTypes.object.isRequired , 
//     cols: PropTypes.object.isRequired , 
// }


export default AcsDataGrid