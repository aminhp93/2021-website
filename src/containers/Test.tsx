import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { groupBy } from 'lodash';

import { getListUrlGoValue } from 'reducers/stocks';
import { getPosts } from 'reducers/post';

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
                console.log(response)
                let result = [];
                response.map(i => result = result.concat(i))
                console.log(result)
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
        console.log(groupBy(data, 'mappedDate'))
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
                                const symbol = k.symbol;
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
                        console.log(objectKeys)
                        const mappedArray = Object.values(objectKeys).sort((a, b) => b.count - a.count).slice(0, 10)
                        console.log(mappedArray)
                        return <div>
                            <div>{i} - {mappedDateObj[i].length}</div>
                            <div>
                                {mappedArray.map(item => {
                                    return <div>{item.symbol} - {item.count}</div>
                                })}
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