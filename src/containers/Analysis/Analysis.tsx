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
        return <MarketAnalysis />
    }
}

export default Analysis;