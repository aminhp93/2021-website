import React from 'react';
import { Tabs } from 'antd';

import MarketAnalysis from 'containers/analysis/MarketAnalysis';
import CompanyAnalysis from 'containers/analysis/CompanyAnalysis';
import AccumulatedAssets from 'containers/analysis/AccumulatedAssets';


const { TabPane } = Tabs;

interface IProps { }

interface IState { }

class Analysis extends React.Component<IProps, IState> {
    render() {
        return (
            <div className="Analysis height100">
                <Tabs defaultActiveKey="1" className="height100">
                    <TabPane tab="MarketAnalysis" key="1">
                        <MarketAnalysis />
                    </TabPane>
                    <TabPane tab="AccumulatedAssets" key="2">
                        <AccumulatedAssets />
                    </TabPane>
                    <TabPane tab="CompanyAnalysis" key="3">
                        <CompanyAnalysis />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Analysis;