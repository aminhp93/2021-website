import React from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


interface IProps {
    columnDefs: any, 
    defaultColDef: any,
    rowData: any,
    onGridReady: any
}

interface IState {}

class CustomAgGridReact extends React.Component <IProps, IState>{

    render() {
        const { columnDefs, defaultColDef, rowData, onGridReady } = this.props;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div
                    id="myGrid"
                    style={{
                        height: '500px',
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        modules= {[ClientSideRowModelModule]}
                        enableRangeSelection={true}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        rowData={rowData}
                        rowSelection={'single'}
                    />
                </div>
            </div>
        )
    }
}

export default CustomAgGridReact