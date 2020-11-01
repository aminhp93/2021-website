import React from 'react';
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';
import { Tabs, Select, Spin, Button } from 'antd';


interface IProps { }

interface IState { 
}

class CompanyReport extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {  } = this.state;
        return (
            <div className="CompanyReport height100">
                <div className="flex height100">
                    <div className="flex-1 bg-light-blue">
                        Cai chung
                        <hr/>
                        <div>
                            BCTC
                        </div>
                    </div>
                    <div className="flex-1 bg-light-yellow">
                        Cai rieng
                        <hr/>
                        <div>
                            Tien do du an
                        </div>
                        <div>
                            Tin tuc co phieu
                        </div>
                        <div>
                            Khoi luong mua/ban
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CompanyReport;