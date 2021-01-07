import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Button, Modal, Input, Radio, Switch, Table } from 'antd';
import { debounce, get } from 'lodash';
import moment from 'moment'

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
import { marketAnalysisColumnDefs } from 'utils/columnDefs';

import ChartTV from 'containers/ChartTV/ChartTV';
import SymbolNote from 'containers/SymbolNote';
import CompanyAnalysis from 'containers/analysis/CompanyAnalysis';
import CustomAgGridReact from 'components/CustomAgGridReact';

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
    latestFinancialInfo: any;
}

interface IState {
    columnDefs: any,
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
    symbol: string
}

class MarketAnalysis extends React.Component<IProps, IState> {
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
            columnDefs: marketAnalysisColumnDefs(this),
            rowData: [],
            startDate: getPreviousDate(this.props.lastUpdatedDate.value),
            endDate: getEndDate(this.props.lastUpdatedDate.value),
            visibleChart: false,
            visibleInfo: false,
            addVN30Stock: [],
            data: [],
            checkBlackList: true,
            checkStrong: true,
            symbol: ''
        }
        this.scan = debounce(this.scan, 300);
        this.scanning = false;
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.props.updateSelectedSymbolSuccess(null)
        this.scan()
    };

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

    scan = async () => {
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
                    ChangePrice: -100,
                    MinPrice: 0,
                    TodayCapital: 0,
                }
            }
            res = await this.props.scanStock(data);
            this.scanning = false
            this.gridApi.hideOverlay()
            this.setState({
                rowData: res
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
            columnDefs: marketAnalysisColumnDefs(this, e.target.value)
        })
    }

    componentDidUpdate(preProps) {
        if (this.props.selectedSymbol !== preProps.selectedSymbol) {
            this.scan();
        }
    }

    render() {
        const { startDate, endDate, rowData,
            columnDefs,
            visibleChart, visibleInfo, type,
            importantIndexType, TodayCapital, MinPrice,
            ChangePrice,
            checkStrong, checkBlackList,
            symbol
        } = this.state;
        return (
            <div className="MarketAnalysis">
                <div>
                    <div>Count: {rowData.length}</div>
                    <div className="flex">
                        <div className="flex-1">
                            <div>
                                <Radio.Group value={type} onChange={this.changeType}>
                                    <Radio.Button value={STOCK_GROUP.CANSLIM}>Canslim</Radio.Button>
                                    <Radio.Button value={STOCK_GROUP.VN30}>VN30</Radio.Button>
                                    <Radio.Button value={STOCK_GROUP.FAVORITE}>Tich san</Radio.Button>
                                    <Radio.Button value={STOCK_GROUP.ONSTUDY}>Study</Radio.Button>
                                    <Radio.Button disabled={true} value={STOCK_GROUP.BLACKLIST}>BlackList</Radio.Button>
                                </Radio.Group>
                            </div>
                            <div>
                                <Radio.Group value={importantIndexType} onChange={this.changeImporantIndex}>
                                    <Radio.Button value="default">Default</Radio.Button>
                                    <Radio.Button disabled={true} value="KhaNangThanhToan">Kha nang thanh toan</Radio.Button>
                                    <Radio.Button disabled={true} value="CoCauTaiSan">Co cau tai san</Radio.Button>
                                    <Radio.Button disabled={true} value="HieuSuatHoatDong">Hieu suat hoat dong</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex MarketAnalysis-Filter">
                                <Input addonBefore="ICBCode" onChange={(e) => this.changeInput(e, 'ICBCode')} />
                                <Input addonBefore="Min P" onChange={(e) => this.changeInput(e, 'MinPrice')} value={MinPrice} />
                                <Input addonBefore="%P" onChange={(e) => this.changeInput(e, 'ChangePrice')} value={ChangePrice} />
                                <Input addonBefore="TodayCap" onChange={(e) => this.changeInput(e, 'TodayCapital')} value={TodayCapital} />
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
                            <div>
                                <RangePicker onChange={this.onChange} value={startDate ? [moment(startDate), moment(endDate)] : null} />
                                <Button onClick={() => {
                                    this.props.updateSelectedSymbolSuccess(null)
                                    this.scan()
                                }}>Xem</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <CustomAgGridReact
                    columnDefs={columnDefs}
                    onGridReady={this.onGridReady}
                    rowData={rowData}
                />

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
                            <ChartTV symbol={symbol} />
                            <CompanyAnalysis data={this.state} />
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
                        <SymbolNote symbol={symbol} />
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
        selectedSymbol: get(state, 'selectedSymbol'),
        latestFinancialInfo: get(state, 'latestFinancialInfo')
    }
}

const mapDispatchToProps = {
    filterStocks,
    updateStock,
    scanStock,
    updateSelectedSymbolSuccess,
    getLatest
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketAnalysis);
