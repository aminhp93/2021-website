import React from 'react';
import { Tabs } from 'antd';

import AnalysisDaily from './AnalysisDaily';


const { TabPane } = Tabs;

interface IProps { }

interface IState { }

class Analysis extends React.Component<IProps, IState> {
    render() {
        return (
            <div className="Analysis">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="AnalysisDaily" key="1">
                        <AnalysisDaily />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Analysis;