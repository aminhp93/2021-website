import React from 'react';
import axios from 'axios';
import { Tabs, Select, Spin, Button } from 'antd';
import { connect } from 'react-redux';
import { get, debounce, cloneDeep } from 'lodash';
import moment from 'moment';

import { IStock } from 'types'
import { fetchListStocks, } from 'reducers/stocks';
import { fetchCompany } from 'reducers/companies';
import { updateSelectedSymbolSuccess } from 'reducers/selectedSymbol';
import { getLastUpdatedDate, updateLastUpdatedDate } from 'reducers/lastUpdatedDate';
import { fetchDecisiveIndexes } from 'reducers/decisiveIndexes';
import {
    getHistoricalQuotesUpdateUrl,
} from 'utils/request';

import Analysis from './Analysis/Analysis';
import MarketNews from './MarketNews';
import Financial from './Financial';
import Report from './Report/Report';


const { TabPane } = Tabs;
const { Option } = Select;


interface IProps {
    selectedSymbol: number,
    stocks: IStock,
    lastUpdatedDate: any,
    updateSelectedSymbolSuccess: any,
    fetchListStocks: any,
    getLastUpdatedDate: any,
    fetchCompany: any,
    fetchDecisiveIndexes: any,
    updateLastUpdatedDate: any,
}

interface IState {
    data: any,
    value: any,
    fetching: boolean,
    loading: boolean,
}

class Stock extends React.Component<IProps, IState> {
    lastFetchId: any;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: [],
            fetching: false,
            loading: true,
        }
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    componentDidMount() {
        if (window.location.pathname !== "/stickies") {
            const a = document.querySelector(".lm_goldenlayout.lm_item.lm_root");
            a && a.remove();
        }
        try {
            const promise1 = this.props.getLastUpdatedDate()
            const promise2 = this.props.fetchListStocks()
            const promise3 = this.props.fetchCompany()
            const promise4 = this.props.fetchDecisiveIndexes()
            Promise.all([promise1, promise2, promise3, promise4])
                .then(response => {
                    this.setState({ loading: false })
                })

        } catch (error) {
            this.setState({ loading: false })
        }
    }

    handleChange = (value, data) => {
        this.setState({
            value: [],
            data: [],
            fetching: false,
        }, () => {
            data && data.length && this.props.updateSelectedSymbolSuccess(data[0].data.id);
        });
    };


    fetchUser = value => {
        this.setState({
            data: [],
            fetching: true
        }, () => {
            const filteredStocks = Object.values(this.props.stocks).filter(item => {
                return (item.Symbol || '').toLowerCase().includes((value || '').toLowerCase())
            })
            this.setState({
                data: filteredStocks,
                fetching: false
            })
        });
    };

    udpateHistoricalQuotesDaily = async () => {
        const { lastUpdatedDate } = this.props;
        const lastUpdatedDateValue = lastUpdatedDate.value
        const todayDate = moment().format('YYYY-MM-DD');
        const next1Day = moment(lastUpdatedDateValue).add(1, 'days').format('YYYY-MM-DD');
        const next2Day = moment(lastUpdatedDateValue).add(2, 'days').format('YYYY-MM-DD');
        if (
            !lastUpdatedDateValue
            || lastUpdatedDateValue === todayDate
            || (moment(lastUpdatedDateValue).format('dddd') === 'Friday' && next1Day === todayDate)
            || (moment(lastUpdatedDateValue).format('dddd') === 'Friday' && next2Day === todayDate)
        ) return;

        const startDate = next1Day;
        const endDate = todayDate;
        this.setState({ loading: true })
        await this.udpateHistoricalQuotesPartial(0, 500, startDate, endDate);
        await this.udpateHistoricalQuotesPartial(500, 1000, startDate, endDate);
        await this.udpateHistoricalQuotesPartial(1000, 2000, startDate, endDate);
        await this.props.updateLastUpdatedDate(lastUpdatedDate);
        this.setState({ loading: false })
    }

    udpateHistoricalQuotesPartial = (start, count, startDate, endDate) => {
        const listPromises = [];
        const arr = cloneDeep(Object.values(this.props.stocks));
        const arr1 = arr.slice(start, count)
        arr1.forEach(item => {
            item.Symbol && listPromises.push(
                new Promise(resolve => {
                    this.udpateHistoricalQuotes(item.Symbol, resolve, startDate, endDate);
                })
            );
        });

        return Promise.all(listPromises)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    udpateHistoricalQuotes = (symbol, resolve, startDate, endDate) => {
        if (!symbol || !startDate || !endDate) return;
        axios({
            method: 'put',
            url: getHistoricalQuotesUpdateUrl(symbol, startDate, endDate)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error);
                resolve && resolve(error)
            })
    }

    render() {
        const { fetching, data, value, loading } = this.state;
        const { selectedSymbol, lastUpdatedDate, stocks } = this.props;
        const symbol = (stocks[selectedSymbol] || {}).Symbol
        if (loading) return <Spin size='large' />
        return (
            <div className="Stock height100">
                <div className="Stock-header">
                    <div className="Stock-search">
                        <Select
                            mode="multiple"
                            labelInValue
                            value={value}
                            placeholder="Select stock"
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={this.fetchUser}
                            onChange={this.handleChange}
                            style={{ width: '200px' }}
                        >
                            {data.map(d => (
                                <Option value={d.Symbol} key={d.Symbol} data={d}>{d.Symbol}</Option>
                            ))}
                        </Select>
                        <Button onClick={this.udpateHistoricalQuotesDaily}>Update daily all</Button>

                    </div>
                    <div className="Stock-header-symbol">
                        {symbol || 'No symbol selected'} |
                        Last udpated: {moment(lastUpdatedDate.value).format('YYYY-MM-DD')}
                        <span onClick={() => this.props.updateSelectedSymbolSuccess(null)}>Clear</span>
                    </div>
                </div>
                <div className="Stock-container height100">
                    <div className="height100">
                        <div className="height100">
                            <Tabs defaultActiveKey="4" tabPosition="left" className="height100">
                                <TabPane tab="Stock" key="1">
                                    <div className="Stock-content">
                                        <div>
                                            <Tabs defaultActiveKey="7">
                                                <TabPane tab="Transaction" key="1">
                                                    {/* <Transaction /> */}
                                                </TabPane>
                                                <TabPane tab="Profile" key="2">
                                                    {/* <Profile /> */}
                                                </TabPane>
                                                <TabPane tab="Stakeholder" key="3">
                                                    {/* <Stakeholder /> */}
                                                </TabPane>
                                                <TabPane tab="EquityAndDividends" key="4">
                                                    {/* <EquityAndDividends /> */}
                                                </TabPane>
                                                <TabPane tab="News" key="5">
                                                    {/* <News /> */}
                                                </TabPane>
                                                <TabPane tab="Price" key="6">
                                                    {/* <Price /> */}
                                                </TabPane>
                                                <TabPane tab="Financial" key="7">
                                                    <Financial />
                                                </TabPane>
                                                <TabPane tab="Technical" key="8">
                                                    {/* <Technical /> */}
                                                </TabPane>
                                                <TabPane tab="ImportantIndexes" key="9">
                                                    {/* <ImportantIndexes /> */}
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab="Analysis" key="2">
                                    <Analysis />
                                </TabPane>
                                <TabPane tab="News" key="3">
                                    <MarketNews />
                                </TabPane>
                                <TabPane tab="Report" key="4">
                                    <Report />
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        stocks: get(state, 'stocks'),
        lastUpdatedDate: get(state, 'lastUpdatedDate')
    }
}

const mapDispatchToProps = {
    getLastUpdatedDate,
    fetchListStocks,
    updateSelectedSymbolSuccess,
    fetchCompany,
    fetchDecisiveIndexes,
    updateLastUpdatedDate
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock);
