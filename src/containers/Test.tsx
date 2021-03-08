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
import Axios from 'axios';
import {
    getHistoricalQuotesUpdateUrl,
} from 'utils/request';
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
    data2: any,
}

const NUMBER_CALL_POST = 200

class Test extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data2: [],
            total: [],
            postIds: [],
            replies: []
        }
    }
    async componentDidMount() {
        // const res = await this.props.getListUrlGoValue();
        // if (!res.data.results) return;
        // this.setState({ 
        //     data2: res.data.results.sort((a,b) => b.idea_id - a.idea_id)
        // })
        // if (window.location.pathname !== "/stickies") {
        //     const a = document.querySelector(".lm_goldenlayout.lm_item.lm_root");
        //     a && a.remove();
        // }
        // this.getAllPosts()
        // const a = await Axios.get('https://chart-api.vndirect.com.vn/1.1/charts?client=vnds_trading_view&user=vnds-0001813109')
        // console.log(a.data)
        // a.data.data.map(i => {
        //     let url = `https://chart-api.vndirect.com.vn/1.1/charts?client=vnds_trading_view&user=vnds-0001813109&chart=${i.id}`
        //     Axios.delete(url)
        // })

        // Axios({
        //     method: 'put',
        //     url: getHistoricalQuotesUpdateUrl('FPT', '2021-02-05', '2021-02-05')
        // })
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })

        // this.update();
    }

    update = () => {
        // .match(/.{1,3}/g)
        
        Axios({
            method: 'put',
            url: 'https://restv2.fireant.vn/me/watchlists/360431',
            headers: {
                Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTE1MTI5NTc2LCJuYmYiOjE2MTUxMjk1NzYsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiJkNzJjOWQxNy0xNDU2LTQ1Y2EtOWQ2NC00YTA5ZWI3ZmU3Y2IiLCJhdXRoX3RpbWUiOjE2MTUxMjk1NjAsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWNAZ21haWwuY29tIiwic2VjdXJpdHlfc3RhbXAiOiI1MjdjZTNhNi02ZjlmLTQ5YWYtOWZiYy05MWE1ODcyZTgxNDgiLCJqdGkiOiI2NTM3OTA3ZDA3ZDY5ZDUwNjhjZjhhOGQ0YWI2ZGI0OCIsImFtciI6WyJleHRlcm5hbCJdfQ.GdgdiQ8VZAjph7HdT0Qomzll8wXV1BQ9CkojQhNG70G3b4wkjxda2hSM6VZ4-O6SkHwh0viYiH4haPTFBdceRnvY47xQgnJFFtkzZ9QKf9UyRiwAagQhm5WaXUmlQxb_pV2AwQQ0cfMxKzkXRrZtuFaK1BkQASFTpG0k094OF2yKpB5wtBq0j_9eMSwCHy4qbeBdjGYp6x94F0Uac8Znzg-oll9AI3eY5JSqpMAuGdve4CcK4I1a89-1-mFQ-CZIN3LBn7hKkqw3FDq4ac4viYESXrktTEpEI7o5ii9C5yYYv7Dnu7cwwmCLzEMJsmyZMkHiZ3SwmtimRIZ62E2fSA'
            },
            data: {
                name: "side way",
                symbols: ["AAA", "ACB", "ACV", "AGG", "AGR", "AMV", "APH", "BID", "BMP", "BSI", "BVB", "BWE", "CII", "CKG", "CRE", "CTD", "CTG", "CTI", "CTR", "CTS", "D2D", "DBC", "DHC", "DPG", "DRC", "DRH", "DVN", "EIB", "FMC", "FPT", "FRT", "GAS", "GEX", "GMD", "GVR", "HBC", "HCM", "HDB", "HDC", "HDG", "HHS", "HND", "HPG", "ILB", "IMP", "ITA", "KDC", "KOS", "L14", "MBB", "MPC", "MSN", "MWG", "NAF", "NDN", "NHA", "NLG", "NT2", "NTL", "NVL", "PDR", "PHR", "PLX", "PNJ", "POW", "PPC", "PTB", "PVT", "QNS", "REE", "SBT", "SGP", "SHB", "SHS", "SJS", "SSI", "STB", "SZC", "TAR", "TCB", "TCM", "TDM", "TPB", "TV2", "VCB", "VCG", "VCI", "VCS", "VGC", "VHC", "VHM", "VIC", "VIP", "VJC", "VND", "VOC", "VPB", "VPG", "VPI", "VRE"],
                userName: "minhpn.org.ec@gmail.com",
                watchlistID: 360431
            }
            
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            })
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
        const { data, total, postIds, replies, data2 } = this.state;
        const mappedDateObj = groupBy(data, 'mappedDate')
        const dataGroupByPostID = groupBy(data, 'postID')
        
        return (
            <div className="flex">
                <div>
                    
                {data2.map(i => {
                    const slug = 'https://app.govalue.vn/' + i.slug
                    return <div><a href={slug} target="_blank">{i.idea_id} - {moment(i.create_date).format('YYYY-MM-DD')} - {slug}</a></div>
                })}
                </div>
                
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