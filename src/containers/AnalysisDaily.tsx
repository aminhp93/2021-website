import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Button, Modal, Input, Radio, Switch } from 'antd';
import { debounce, get, each } from 'lodash';
import moment from 'moment'

import {
    filterStocks,
    updateStock,
    scanStock
} from 'reducers/stocks';
import ChartTV from './ChartTV/ChartTV';
import FinalAnalysis from './FinalAnalysis';
import Summary from './Summary';
import { IStock } from 'types'
import { analysisDailyColumnDefs } from '../utils/columnDefs';
import { updateSelectedSymbolSuccess } from '../reducers/selectedSymbol';

import { AgGridReact } from 'ag-grid-react';
// import { AllModules } from '@ag-grid-enterprise/all-modules';
// import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
// import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


import { getPreviousDate } from 'utils/all'
import { BILLION_UNIT } from 'utils/unit';
import { STOCK_GROUP } from 'utils/constant';

const { RangePicker } = DatePicker;


interface IProps {
    selectedSymbol: string,
    stocks: IStock,
    filterStocks: any,
    updateStock: any,
    lastUpdatedDate: any,
    scanStock: any,
    companies: any,
    decisiveIndexes: any,
    updateSelectedSymbolSuccess: any
}

interface IState {
    // modules: any,
    columnDefs: any,
    defaultColDef: any,
    rowData: any,
    visibleChart: boolean,
    visibleInfo: boolean,
    Symbol: string,
    startDate: string,
    endDate: string,
    type: string,
    addVN30Stock: any,
    value?: any,
    data?: any,
    fetching?: boolean,
    importantIndexType: any,
    TodayCapital: number,
    MinPrice: number,
    ChangePrice: number,
    show: boolean,
    checkBlackList: boolean,
    checkStrong: boolean,
}

class AnalysisDaily extends React.Component<IProps, IState> {
    gridApi: any;
    gridColumnApi: any;
    scanning: boolean;

    constructor(props) {
        super(props);
        this.state = {
            type: STOCK_GROUP.CANSLIM,
            importantIndexType: 'default',
            ChangePrice: 1,
            TodayCapital: 5,
            MinPrice: 5000,
            Symbol: '',
            // modules: AllModules,
            columnDefs: analysisDailyColumnDefs(this),
            defaultColDef: {
                flex: 1,
                filter: true,
                sortable: true,
                minWidth: 100,
                enableValue: true,
                enableRowGroup: true,
                enablePivot: true,
            },
            rowData: [],
            startDate: getPreviousDate(this.props.lastUpdatedDate.value),
            endDate: moment(this.props.lastUpdatedDate.value).format('YYYY-MM-DD') + 'T00:00:00Z',
            visibleChart: false,
            visibleInfo: false,
            addVN30Stock: [],
            data: [],
            show: true,
            checkBlackList: true,
            checkStrong: true
        }
        this.scan = debounce(this.scan, 300);
        this.scanning = false;
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.scan();
    };

    mapData = (data) => {
        const { companies, stocks, decisiveIndexes } = this.props;

        each(data, i => {
            i.ICBCode = Number((companies[i.Stock] || {}).ICBCode)
            i.Symbol = (stocks[i.Stock] || {}).Symbol
            i.LowestPoint = (decisiveIndexes[i.Stock] || {}).LowestPoint
            i.LowestPointChange = (i.PriceClose - (decisiveIndexes[i.Stock] || {}).LowestPoint) / (decisiveIndexes[i.Stock] || {}).LowestPoint * 100
            i.PE = Number(i.PE)
            i.PS = Number(i.PS)
            i.PB = Number(i.PB)
            i.EPS = Number(i.EPS)
            i.QuickRatio = Number(i.QuickRatio)
            i.CurrentRatio = Number(i.CurrentRatio)
            i.TotalDebtOverEquity = Number(i.TotalDebtOverEquity)
            i.TotalDebtOverAssets = Number(i.TotalDebtOverAssets)
            i.TotalAssetsTurnover = Number(i.TotalAssetsTurnover)
            i.InventoryTurnover = Number(i.InventoryTurnover)
            i.ReceivablesTurnover = Number(i.ReceivablesTurnover)
            i.GrossMargin = Number(i.GrossMargin)
            i.OperatingMargin = Number(i.OperatingMargin)
            i.EBITMargin = Number(i.EBITMargin)
            i.NetProfitMargin = Number(i.NetProfitMargin)
            i.ROA = Number(i.ROA)
            i.ROE = Number(i.ROE)
            i.ROIC = Number(i.ROIC)
            return i
        })
        return data
    }

    onChange = (date, dateString) => {
        if (dateString && dateString.length === 2) {
            this.setState({
                startDate: dateString[0] + 'T00:00:00Z',
                endDate: dateString[1] + 'T00:00:00Z'
            })
        }
    }

    handleOk = e => {
        this.setState({
            visibleChart: false,
            visibleInfo: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visibleChart: false,
            visibleInfo: false,
        });
    };

    changeInput = (e, index) => {
        const data: any = {};
        if (index === 'Symbol') {
            data[index] = e.target.value.toUpperCase();
            data.MinPrice = 0;
            data.TodayCapital = 0;
            data.ChangePrice = -100;
        } else if (['TodayCapital', 'MinPrice', 'ICBCode'].includes(index)) {
            // if (e.target.value.match(/\D/)) return
            data[index] = Number(e.target.value);
        } else {
            data[index] = e.target.value
        }
        this.setState(data)
    }

    scan = async () => {
        if (this.scanning) return;
        try {
            const { type, ChangePrice, TodayCapital } = this.state;
            let data = { ...this.state }
            data[type] = true
            data['ChangePrice'] = Number(ChangePrice)
            data['TodayCapital'] = Number(TodayCapital) * BILLION_UNIT
            this.gridApi.showLoadingOverlay();
            this.scanning = true
            const res = await this.props.scanStock(data);
            this.scanning = false
            this.gridApi.hideOverlay()
            this.setState({
                rowData: this.mapData(res.data)
            })
        } catch (error) {
            this.scanning = false
        }
    }

    changeType = (e) => {
        if (e.target.value === STOCK_GROUP.CANSLIM) {
            this.setState({
                type: e.target.value,
                Symbol: '',
                MinPrice: 5000,
                TodayCapital: 5,
                ChangePrice: 1
            }, () => this.scan())
        } else {
            this.setState({
                type: e.target.value,
                Symbol: '',
                MinPrice: -1,
                TodayCapital: -1,
                ChangePrice: -100
            }, () => this.scan())
        }
    }

    changeImporantIndex = (e) => {
        this.setState({
            importantIndexType: e.target.value,
            columnDefs: analysisDailyColumnDefs(this, e.target.value)
        })
    }

    render() {
        const { startDate, endDate, rowData,
            // modules,
            columnDefs, defaultColDef,
            visibleChart, visibleInfo, type,
            importantIndexType, TodayCapital, MinPrice,
            ChangePrice, show, Symbol: symbol,
            checkStrong, checkBlackList
        } = this.state;
        console.log(this.state);
        return (
            <div className="AnalysisDaily">
                <div>
                    <div>Count: {rowData.length}</div>
                    <div>

                        <Radio.Group value={type} onChange={this.changeType}>
                            <Radio.Button value={STOCK_GROUP.CANSLIM}>Canslim</Radio.Button>
                            <Radio.Button value={STOCK_GROUP.VN30}>VN30</Radio.Button>
                            <Radio.Button value={STOCK_GROUP.FAVORITE}>Favorite</Radio.Button>
                            <Radio.Button value={STOCK_GROUP.ONSTUDY}>Study</Radio.Button>
                            <Radio.Button value={STOCK_GROUP.BLACKLIST}>BlackList</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div>
                        <div className="flex AnalysisDaily-Filter">
                            <Input addonBefore="Symbol" value={symbol} onChange={(e) => this.changeInput(e, 'Symbol')} onPressEnter={() => {
                                this.scan();
                                this.props.updateSelectedSymbolSuccess(symbol)
                            }} />
                            <Input addonBefore="ICBCode" onChange={(e) => this.changeInput(e, 'ICBCode')} />
                            <Input addonBefore="Min Price" onChange={(e) => this.changeInput(e, 'MinPrice')} value={MinPrice} />
                            <Input addonBefore="%ChangePrice" onChange={(e) => this.changeInput(e, 'ChangePrice')} value={ChangePrice} />
                            <Input addonBefore="TodayCapital" onChange={(e) => this.changeInput(e, 'TodayCapital')} value={TodayCapital} />
                            <Switch
                                checkedChildren="STR"
                                unCheckedChildren="STR"
                                defaultChecked
                                checked={checkStrong}
                                onChange={() => this.setState({ checkStrong: !checkStrong })}
                            />
                            <Switch
                                checkedChildren="BLL"
                                unCheckedChildren="BLL"
                                defaultChecked
                                checked={checkBlackList}
                                onChange={() => this.setState({ checkBlackList: !checkBlackList })}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <RangePicker onChange={this.onChange} value={startDate ? [moment(startDate), moment(endDate)] : null} />
                    <Button onClick={() => this.scan()}>Xem</Button>
                </div>

                <div>
                    <Radio.Group value={importantIndexType} onChange={this.changeImporantIndex}>
                        <Radio.Button value="KhaNangThanhToan">Kha nang thanh toan</Radio.Button>
                        <Radio.Button value="CoCauTaiSan">Co cau tai san</Radio.Button>
                        <Radio.Button value="HieuSuatHoatDong">Hieu suat hoat dong</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{ width: '100%', height: '100%' }}>
                    <div
                        id="myGrid"
                        style={{
                            height: '500px',
                        }}
                        className="ag-theme-alpine"
                    >
                        <AgGridReact
                            // modules={modules}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={this.onGridReady}
                            rowData={rowData}
                            // sideBar={true}
                            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                        />
                    </div>
                </div>

                {visibleChart ?
                    <Modal
                        wrapClassName="customed-modal-wrap"
                        title={<div onClick={() => this.setState({ show: !show })}>Show</div>}
                        visible={visibleChart}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >

                        <div className="chartTV-container">
                            <ChartTV symbol={symbol} />
                            {/* {show && <Summary data={this.state} />} */}
                        </div>
                    </Modal>
                    : null}
                {visibleInfo
                    ? <Modal
                        title="Basic Modal"
                        wrapClassName="customed-modal-wrap"
                        visible={visibleInfo}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <FinalAnalysis symbol={symbol} />
                    </Modal>
                    : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        stocks: get(state, 'stocks'),
        lastUpdatedDate: get(state, 'lastUpdatedDate') || {},
        companies: get(state, 'companies'),
        decisiveIndexes: get(state, 'decisiveIndexes')
    }
}

const mapDispatchToProps = {
    filterStocks,
    updateStock,
    scanStock,
    updateSelectedSymbolSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisDaily);


