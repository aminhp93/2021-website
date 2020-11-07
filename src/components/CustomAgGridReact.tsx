import React from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


interface IProps {
    columnDefs?: any,
    defaultColDef?: any,
    rowData?: any,
    onGridReady?: any,
    height?: any
}

interface IState { }

class CustomAgGridReact extends React.Component<IProps, IState>{
    constructor(props) {
        super(props);
        this.state = {}
    }

    static defaultProps = {
        defaultColDef: {
            flex: 1,
            filter: true,
            sortable: true,
            // minWidth: 100,
            // enableValue: true,
            // enableRowGroup: true,
            // enablePivot: true,
            // resizable: true
        }
    }

    render() {
        const { columnDefs, defaultColDef, rowData, onGridReady, height } = this.props;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div
                    id="myGrid"
                    style={{
                        height: height || '500px',
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        modules={[ClientSideRowModelModule]}
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