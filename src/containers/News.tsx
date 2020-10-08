import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { List, Avatar, Pagination, Modal } from 'antd';
import moment from 'moment';
import { get } from 'lodash';

import { getCompanyNewsUrl } from 'utils/request';
import { IStock, ICompanyNews } from 'types'

interface IProps {
    selectedSymbol: string,
    stocks: IStock,
    lastUpdatedDate: string,
    dataSource: [ICompanyNews?]
}

interface IState {
    CompanyNewsCountString: number,
    CompanyNewsArray: [ICompanyNews?],
    visible: boolean,
    NewsContent: string
}

class News extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            CompanyNewsCountString: 0,
            CompanyNewsArray: [],
            visible: false,
            NewsContent: ''
        }
    }

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    changePagination = (index) => {
        axios({
            method: 'get',
            url: getCompanyNewsUrl(index),
        })
            .then(response => {
                if (response.data) {
                    this.setState({
                        CompanyNewsArray: response.data
                    })
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        const {
            CompanyNewsCountString,
            NewsContent
        } = this.state;
        const { dataSource } = this.props;
        return (
            <div>
                <div>TIN TỨC</div>
                <div>
                    <List
                        itemLayout="horizontal"
                        dataSource={dataSource}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<div>{moment(item.Date).format('MM/DD/YYYY')}</div>}
                                    title={<a href={item.NewsUrl} target="_blank" rel="noopener noreferrer">{item.Title}</a>}
                                    description={item.Description}
                                />
                            </List.Item>
                        )}
                    />
                    <Pagination defaultCurrent={1} total={CompanyNewsCountString} onChange={this.changePagination} />
                </div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {ReactHtmlParser(NewsContent)}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        stocks: get(state, 'stocks'),
        lastUpdatedDate: get(state, 'lastUpdatedDate')
    }
}

export default connect(mapStateToProps, null)(News);