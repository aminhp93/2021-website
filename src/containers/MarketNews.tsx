import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { get } from 'lodash';


import News from './News';

import { IStock } from 'types'
import { fetchNews } from 'reducers/stocks';


const { TabPane } = Tabs;

interface IProps {
    selectedSymbol: string,
    stocks: IStock,
    lastUpdatedDate: string,
    fetchNews: any,
}

interface IState {
    newsDataSource: any,
    key: string
}

class MarketNews extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            newsDataSource: [],
            key: '1',
        }
    }

    componentDidMount() {
        this.crawlData();
    }

    componentDidUpdate(preProps) {
        console.log('componentDidUpdate News', this.props, preProps)
        if (this.props.selectedSymbol !== preProps.selectedSymbol) {
            this.crawlData();
        }
    }

    crawlData = async () => {
        try {
            let type
            let group
            let startIndex = '0'
            let count = '10'
            let symbol = ''
            const { selectedSymbol } = this.props;
            switch (this.state.key) {
                case '1':
                    type = 'AllNews'

                    break;
                case '2':
                    type = 'PositiveNews'

                    break;
                case '3':
                    type = 'NegativeNews'

                    break;
                case '4':
                    type = 'NewsInGroup'
                    group = 1
                    break;
                case '5':
                    type = 'NewsInGroup'
                    group = 2
                    break;
                case '6':
                    type = 'NewsInGroup'
                    group = 3
                    break;
                case '7':
                    type = 'NewsInGroup'
                    group = 4
                    break;
                case '8':
                    type = 'NewsInGroup'
                    group = 5
                    break;
                case '9':
                    type = 'NewsInGroup'
                    group = 6
                    break;
                case '10':
                    type = 'CompanyNews'
                    group = null
                    symbol = selectedSymbol
                default:
                    break;
            }
            const res = await this.props.fetchNews({ type, group, startIndex, count, symbol })
            this.setState({ newsDataSource: res.data })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { key, newsDataSource } = this.state;
        const { selectedSymbol } = this.props;
        return (
            <div>
                <Tabs defaultActiveKey={key} onChange={(key) => this.setState({ key }, () => this.crawlData())}>
                    <TabPane tab="Moi nhat" key="1">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Tich cuc" key="2">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Tieu cuc" key="3">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Thi truong" key="4">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Doanh nghiep" key="5">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Tai chinh" key="6">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Kinh te" key="7">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="The gioi" key="8">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab="Bat dong san" key="9">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                    <TabPane tab={selectedSymbol} key="10">
                        <News dataSource={newsDataSource} />
                    </TabPane>
                </Tabs>
            </div>
        )
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
    fetchNews
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketNews);