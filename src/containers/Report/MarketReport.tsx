import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { get } from 'lodash';

import {
  getLatest
} from 'reducers/stocks';
import { getPreviousDate, getEndDate } from 'utils/common';

interface IProps {
  getLatest: any;
  lastUpdatedDate: any;
}

interface IState { 
  startDate: any;
  endDate: any;
  data01: any;
}
class MarketReport extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
          startDate: getPreviousDate(this.props.lastUpdatedDate.value),
          endDate: getEndDate(this.props.lastUpdatedDate.value),
          data01: []
        }
    }

    componentDidMount() {
      const { startDate, endDate } = this.state;
      // Total
      let data1: any = { 
        ChangePrice: -10,
        MinPrice: 0,
        TodayCapital: 0,
        endDate,
        startDate,
        checkBlackList: true,
        checkStrong: true,
      }      

      const listPromises = [];
      listPromises.push(this.props.getLatest(data1))
  
      Promise.all(listPromises)
        .then(res => {
          console.log(res)
          this.setState({
            data01: [
              {
                name: 'Total',
                value: res[0].data.length
              },
              {
                name: 'Canslim',
                value: res[0].data.filter(i => i.PriceChange > 1 && i.TodayCapital > 5000000000).length
              },
              {
                name: 'Increase',
                value: res[0].data.filter(i => i.PriceChange > 0).length
              },
              {
                name: 'Decrease',
                value: res[0].data.filter(i => i.PriceChange < 0).length
              },
              {
                name: 'Unchange',
                value: res[0].data.filter(i => i.PriceChange === 0).length
              }
            ]
          })
        })
    }

    render() {
        const { data01 } = this.state;
        return (
            <div className="MarketReport height100">
                MarketReport
                <BarChart
                  width={500}
                  height={300}
                  data={data01}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
      lastUpdatedDate: get(state, 'lastUpdatedDate') || {},
  }
}

const mapDispatchToProps = {
  getLatest
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketReport);
