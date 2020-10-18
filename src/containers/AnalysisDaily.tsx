import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Button, Modal, Input, Radio, Switch } from 'antd';
import { debounce, get, each } from 'lodash';
import moment from 'moment'
import { AgGridReact } from 'ag-grid-react';

import {
    filterStocks,
    updateStock,
    scanStock,
    getLatest
} from 'reducers/stocks';
import { updateSelectedSymbolSuccess } from 'reducers/selectedSymbol';
import { IStock } from 'types';
import { getPreviousDate, getEndDate } from 'utils/common';
import { BILLION_UNIT } from 'utils/unit';
import { STOCK_GROUP } from 'utils/constant';
import { analysisDailyColumnDefs } from 'utils/columnDefs';

import ChartTV from './ChartTV/ChartTV';
import FinalAnalysis from './FinalAnalysis';
import Summary from './Summary';

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const { RangePicker } = DatePicker;


interface IProps {
    stocks: IStock,
    filterStocks: any,
    updateStock: any,
    lastUpdatedDate: any,
    scanStock: any,
    companies: any,
    decisiveIndexes: any,
    updateSelectedSymbolSuccess: any,
    getLatest: any,
    selectedSymbol: number,
}

interface IState {
    columnDefs: any,
    defaultColDef: any,
    rowData: any,
    visibleChart: boolean,
    visibleInfo: boolean,
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
            endDate: getEndDate(this.props.lastUpdatedDate.value),
            visibleChart: false,
            visibleInfo: false,
            addVN30Stock: [],
            data: [],
            checkBlackList: true,
            checkStrong: true
        }
        this.scan = debounce(this.scan, 300);
        this.scanning = false;
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.props.updateSelectedSymbolSuccess(null)
        this.scan(true)
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
            i.VolumeChange = Number(i.DealVolume / i.AverageVolume30)
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
        if (['TodayCapital', 'MinPrice', 'ICBCode'].includes(index)) {
            data[index] = Number(e.target.value);
        } else {
            data[index] = e.target.value
        }

        this.setState(data)
    }

    scan = async (useLatest = false) => {
        if (this.scanning) return;
        try {
            const { type, ChangePrice, TodayCapital } = this.state;
            const { selectedSymbol, stocks } = this.props;
            let data: any = { ...this.state }
            data[type] = true
            data['ChangePrice'] = Number(ChangePrice)
            data['TodayCapital'] = Number(TodayCapital) * BILLION_UNIT
            this.gridApi.showLoadingOverlay();
            this.scanning = true
            let res
            if (selectedSymbol) {
                const symbol = (stocks[selectedSymbol] || {}).Symbol
                data = {
                    Symbol: symbol,
                    endDate: data.endDate,
                    startDate: data.startDate,
                }
            }
            if (useLatest) {
                res = await this.props.getLatest(data);
            } else {
                res = await this.props.scanStock(data);
            }
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
                MinPrice: 5000,
                TodayCapital: 5,
                ChangePrice: 1
            }, () => this.scan())
        } else {
            this.setState({
                type: e.target.value,
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

    componentDidUpdate(preProps) {
        if (this.props.selectedSymbol !== preProps.selectedSymbol) {
            this.scan();
        }
    }

    render() {
        const { startDate, endDate, rowData,
            columnDefs, defaultColDef,
            visibleChart, visibleInfo, type,
            importantIndexType, TodayCapital, MinPrice,
            ChangePrice,
            checkStrong, checkBlackList
        } = this.state;
        const { stocks, selectedSymbol } = this.props;
        const symbol = (stocks[selectedSymbol] || {}).Symbol
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
                    <Button onClick={() => {
                        this.props.updateSelectedSymbolSuccess(null)
                        this.scan()
                    }}>Xem</Button>
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
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={this.onGridReady}
                            rowData={rowData}
                            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                        />
                    </div>
                </div>

                {visibleChart ?
                    <Modal
                        wrapClassName="customed-modal-wrap"
                        title={symbol}
                        visible={visibleChart}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >

                        <div className="chartTV-container">
                            <ChartTV />
                            {<Summary data={this.state} />}
                        </div>
                    </Modal>
                    : null}
                {visibleInfo
                    ? <Modal
                        title={symbol}
                        wrapClassName="customed-modal-wrap"
                        visible={visibleInfo}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <FinalAnalysis />
                    </Modal>
                    : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        stocks: get(state, 'stocks'),
        lastUpdatedDate: get(state, 'lastUpdatedDate') || {},
        companies: get(state, 'companies'),
        decisiveIndexes: get(state, 'decisiveIndexes'),
        selectedSymbol: get(state, 'selectedSymbol')
    }
}

const mapDispatchToProps = {
    filterStocks,
    updateStock,
    scanStock,
    updateSelectedSymbolSuccess,
    getLatest
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisDaily);


