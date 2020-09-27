import React from 'react';

import { Tabs, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import { get, debounce } from 'lodash';
import moment from 'moment';

import { IStock } from 'types'
import { fetchListStocks, } from 'reducers/stocks';
import { fetchCompany } from 'reducers/companies';
import { updateSelectedSymbolSuccess } from 'reducers/selectedSymbol';
import { getLastUpdatedDate } from 'reducers/lastUpdatedDate';
import { fetchDecisiveIndexes } from 'reducers/decisiveIndexes';

import Analysis from './Analysis';

const { TabPane } = Tabs;
const { Option } = Select;


interface IProps {
    selectedSymbol: string,
    stocks: IStock,
    lastUpdatedDate: any,
    updateSelectedSymbolSuccess: any,
    fetchListStocks: any,
    getLastUpdatedDate: any,
    fetchCompany: any,
    fetchDecisiveIndexes: any,
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

    handleChange = value => {
        this.setState({
            value,
            data: [],
            fetching: false,
        }, () => {
            value && value.length && this.props.updateSelectedSymbolSuccess(value[0]['key']);
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

    render() {
        const { fetching, data, value, loading } = this.state;
        const { selectedSymbol, lastUpdatedDate } = this.props;
        if (loading) return <Spin size='large' />
        return (
            <div className="App">
                <div className="App-header">
                    <div className="App-search">
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
                                <Option value={d.Symbol} key={d.Symbol}>{d.Symbol}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="App-header-symbol">
                        {selectedSymbol || 'No symbol selected'} |
                        Last udpated: {moment(lastUpdatedDate.value).format('YYYY-MM-DD')}
                    </div>
                </div>
                <div className="App-container">
                    <div className="App-navigation">
                        <div>
                            <Tabs defaultActiveKey="2" tabPosition="left">
                                <TabPane tab="Stock" key="1">
                                    <div className="App-content">
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
                                                    {/* <Financial /> */}
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
                                    {/* <MarketNews /> */}
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
    console.log(state);
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
    fetchDecisiveIndexes
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock);
