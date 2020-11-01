import React from 'react';
import { Tabs } from 'antd';

import MarketAnalysis from 'containers/analysis/MarketAnalysis';
import CompanyAnalysis from 'containers/analysis/CompanyAnalysis';


const { TabPane } = Tabs;

interface IProps { }

interface IState { }

class Analysis extends React.Component<IProps, IState> {
    render() {
        return (
            <div className="Analysis height100">
                <Tabs defaultActiveKey="2" className="height100">
                    <TabPane tab="MarketAnalysis" key="1">
                        <MarketAnalysis />
                    </TabPane>
                    <TabPane tab="OverallAnalysis" key="2">
                        <CompanyAnalysis />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Analysis;