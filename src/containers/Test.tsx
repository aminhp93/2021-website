import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { groupBy } from 'lodash';

import { getListUrlGoValue } from 'reducers/stocks';
import { getPosts } from 'reducers/post';

import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
  

  const data1 = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
  ];
interface IProps {
    getListUrlGoValue: any,
    getPosts: any,
}

interface IState {
    data: any,
}

class Test extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    async componentDidMount() {
        // const res = await this.props.getListUrlGoValue();
        // if (!res.data.results) return;
        // this.setState({ 
        //     data: res.data.results.sort((a,b) => b.idea_id - a.idea_id)
        // })
        this.getAllPosts()
    }

    getAllPosts = () => {
        const listPromises = [];
        let arrOffset = [];
        for (let i=0; i < 200; i++) {
            arrOffset.push(i*20)
        }
        
        arrOffset.forEach(i => {
            listPromises.push(
                new Promise(resolve => {
                    this.getPosts(i, resolve);
                })
            );
        });

        return Promise.all(listPromises)
            .then(response => {
                let result = [];
                response.map(i => result = result.concat(i))
                result.map(i => i.mappedDate = moment(i.date).format('YYYY-MM-DD'))
                this.setState({ data: result })
            })
            .catch(error => {
                console.log(error)
            })
    }

    getPosts = async (offset, resolve=null) => {
        const res = await this.props.getPosts(0, offset, 20);
        if (res && res.data) {
            resolve && resolve(res.data)
        }

    }

    render() {
        const { data } = this.state;
        const mappedDateObj = groupBy(data, 'mappedDate')
        
        return (
            <div>
                {/* {data.map(i => {
                    const slug = 'https://app.govalue.vn/' + i.slug
                    return <div><a href={slug} target="_blank">{i.idea_id} - {moment(i.create_date).format('YYYY-MM-DD')} - {slug}</a></div>
                })} */}
                <div>Count - { data.length }</div>
                <div>
                    {Object.keys(mappedDateObj).map((i: any) => {
                        const objectKeys: any = {}
                        const array: any = mappedDateObj[i];
                        for (let j=0; j < array.length; j++) {
                            const taggedSymbols = array[j].taggedSymbols;
                            taggedSymbols.map(k => {
                                const symbol = k.symbol.slice(0,3);
                                if (Object.keys(objectKeys).indexOf(symbol) === -1) {
                                    objectKeys[symbol] = {
                                        symbol,
                                        count: 1
                                    }
                                } else {
                                    objectKeys[symbol] = {
                                        symbol,
                                        count: objectKeys[symbol].count + 1
                                    }
                                }
                            })   
                        }
                        
                        const mappedArray = Object.values(objectKeys).sort((a, b) => b.count - a.count).slice(0, 10)
                        
                        return <div>
                            <div>{i} - {mappedDateObj[i].length}
                            
                                <BarChart
                                    width={500}
                                    height={100}
                                    data={mappedArray}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="symbol" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                                <hr/>
                            </div>
                        </div>
                    })}
                </div>
                
            </div>
        )
    }
}


const mapDispatchToProps = {
    getListUrlGoValue,
    getPosts
}

export default connect(null, mapDispatchToProps)(Test);