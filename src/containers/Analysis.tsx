import React from 'react';
import { Tabs } from 'antd';

// import OverviewAnalysis from './OverviewAnalysis';
// import Analysis1 from './Analysis1';
// import Analysis2 from './Analysis2';
// import Analysis3 from './Analysis3';
// import Analysis4 from './Analysis4';
import AnalysisDaily from './AnalysisDaily';
// import MarketNews from './MarketNews';
// import FinancialReportAnalysis from './FinancialReportAnalysis';


const { TabPane } = Tabs;

interface IProps { }

interface IState { }

class Analysis extends React.Component<IProps, IState> {
    render() {
        return (
            <div className="Analysis">
                <Tabs defaultActiveKey="6">
                    <TabPane tab="Overview Analysis" key="1">
                        {/* <OverviewAnalysis /> */}
                    </TabPane>
                    <TabPane tab="CP trong ngay" key="2">
                        {/* <Analysis1 /> */}
                    </TabPane>
                    <TabPane tab="CP cung nganh" key="3">
                        {/* <Analysis2 /> */}
                    </TabPane>
                    <TabPane tab="Chieu doc" key="4">
                        {/* <Analysis3 /> */}
                    </TabPane>
                    <TabPane tab="Chieu ngang" key="5">
                        {/* <Analysis4 /> */}
                    </TabPane>
                    <TabPane tab="Testing" key="6">
                        <AnalysisDaily />
                    </TabPane>
                    <TabPane tab="MarketNews" key="7">
                        {/* <MarketNews /> */}
                    </TabPane>
                    <TabPane tab="Financial Report" key="8">
                        {/* <FinancialReportAnalysis /> */}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Analysis;