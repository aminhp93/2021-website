import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { groupBy, uniq } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import { Input, Button } from 'antd';

import { getListUrlGoValue } from 'reducers/stocks';
import { getPosts, getReplies } from 'reducers/post';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
  
interface IProps {
    getListUrlGoValue: any,
    getPosts: any,
    getReplies: any,
}

interface IState {
    data: any,
    total: any,
    postIds: any,
    replies: any,
}

const NUMBER_CALL_POST = 200

class Test extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: [],
            postIds: [],
            replies: []
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
        for (let i=0; i < NUMBER_CALL_POST; i++) {
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

                const total = this.getTotal(result)
                this.setState({ 
                    data: result,
                    total
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    getTotal = (data) => {
        const xxx: any = {}
        const mappedDateObj = groupBy(data, 'mappedDate')

        Object.keys(mappedDateObj).map((i: any) => {
            const array: any = mappedDateObj[i];
            for (let j=0; j < array.length; j++) {
                const taggedSymbols = array[j].taggedSymbols;
                taggedSymbols.map(k => {
                    const symbol = k.symbol.slice(0,3);
                    if (Object.keys(xxx).indexOf(symbol) === -1) {
                        xxx[symbol] = {
                            symbol,
                            count: 1,
                            postIds: [array[j].postID]
                        }
                    } else {
                        const postIds = xxx[symbol].postIds
                        postIds.push(array[j].postID)
                        xxx[symbol] = {
                            symbol,
                            count: xxx[symbol].count + 1,
                            postIds: uniq(postIds)
                        }
                    }
                })   
            }
        })
        return Object.values(xxx).sort((a, b) => b.count - a.count)
    }

    getPosts = async (offset, resolve=null) => {
        const res = await this.props.getPosts(0, offset, 20);
        if (res && res.data) {
            resolve && resolve(res.data)
        }
    }

    handleClick = (data) => {
        this.handle(data.activeLabel)
    }

    handlePressEnter = e => {
        this.handle(e.target.value)
    }

    getReplies = async (postId) => {
        const res = await this.props.getReplies(postId);
        this.setState({
            replies: res.data
        })
    }

    handle = (data) => {
        const filterSymbol = this.state.total.filter(i => i.symbol === data);
        if (filterSymbol.length === 1) {
            this.setState({
                postIds: filterSymbol[0].postIds
            })
        }
    }

    render() {
        const { data, total, postIds, replies } = this.state;
        const mappedDateObj = groupBy(data, 'mappedDate')
        const dataGroupByPostID = groupBy(data, 'postID')
        
        return (
            <div className="flex">
                {/* {data.map(i => {
                    const slug = 'https://app.govalue.vn/' + i.slug
                    return <div><a href={slug} target="_blank">{i.idea_id} - {moment(i.create_date).format('YYYY-MM-DD')} - {slug}</a></div>
                })} */}
                
                <div>
                    <div>Count - { data.length }</div>
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
                                    onClick={this.handleClick}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="symbol" />
                                    <YAxis />
                                    <Tooltip />
                                    {/* <Legend /> */}
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                                <hr/>
                            </div>
                        </div>
                    })}
                </div>
                
                <div className="flex">
                    <div>
                        <Input onPressEnter={this.handlePressEnter}/>
                        <BarChart
                            width={200}
                            height={500}
                            data={total.slice(0, 10)}
                            layout="vertical"
                            onClick={this.handleClick}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="symbol" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </div>
                    <div className="flex">
                        <div className="flex-1">
                            {postIds.map(i => {
                                return <div >
                                    <div className="flex flex-sp-bt">
                                        <div>{moment(dataGroupByPostID[i][0].date).format("MMMM Do")} - {ReactHtmlParser(dataGroupByPostID[i][0].content)}</div>
                                        <Button onClick={() => this.getReplies(dataGroupByPostID[i][0].postID)}>Com - {dataGroupByPostID[i][0].totalReplies}</Button>
                                    </div>
                                    <hr/>
                                </div>
                            })}
                        </div>
                        <div className="replies">
                            <div>
                                <div>Replies</div>
                                {replies.map(i => {
                                    return <div>
                                        {i.originalContent}
                                        <hr/>
                                        </div>
                                })}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    getListUrlGoValue,
    getPosts,
    getReplies
}

export default connect(null, mapDispatchToProps)(Test);