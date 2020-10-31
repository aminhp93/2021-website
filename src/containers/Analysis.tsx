import React from 'react';
import { Tabs } from 'antd';

import DailyAnalysis from './DailyAnalysis';


const { TabPane } = Tabs;

interface IProps { }

interface IState { }

class Analysis extends React.Component<IProps, IState> {
    render() {
        return (
            <div className="Analysis">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="DailyAnalysis" key="1">
                        <DailyAnalysis />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Analysis;