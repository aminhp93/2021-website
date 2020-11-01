import React from 'react';
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';
import { Tabs, Select, Spin, Button } from 'antd';

import CompanyReport from './CompanyReport';
import MarketReport from './MarketReport';

const { TabPane } = Tabs;

interface IProps { }

interface IState { 
}

class Report extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {  } = this.state;
        return (
            <div className="Report height100">
                <Tabs defaultActiveKey="1" className="height100">      
                    <TabPane tab="MarketReport" key="1">
                        <MarketReport />
                    </TabPane>
                    <TabPane tab="CompanyReport" key="2">
                        <CompanyReport />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Report;