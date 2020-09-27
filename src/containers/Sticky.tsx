import React from 'react';
import axios from 'axios';
import { List, Input, Button } from 'antd';

import moment from 'moment';

import {
    getListNotesUrl,
} from 'utils/request';
import {
    arrayToKeyValue
} from 'utils/all';

import ReactHtmlParser from 'react-html-parser';

const MarkdownIt = require('markdown-it');

const { TextArea } = Input;


class Sticky extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listNotesObj: [],
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: getListNotesUrl()
        })
            .then(response => {
                this.setState({
                    listNotesObj: arrayToKeyValue(response.data)
                })
            })
            .catch(error => {

            })
    }

    renderDescription = (item) => {
        const { allowEdit } = this.state;
        if (allowEdit) {
            return null
            // return <TextArea onChange={e => this.handleChangeInput(e, item.id)} defaultValue={item.content} />
        } else {
            return <div>{this.parseMarkdown(item.content)}</div>
        }
    }

    parseMarkdown = (data) => {
        const md = new MarkdownIt();

        return ReactHtmlParser(md.render(data))
    }

    render() {
        const { listNotesObj } = this.state;
        const listNotesArray = Object.values(listNotesObj)

        return <div className="Sticky">
            <List
                itemLayout="horizontal"
                dataSource={listNotesArray}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            description={
                                <div className="flex">
                                    <div className="Note-created-time">{moment(item.created).format('YYYY-MM-DD')}</div>
                                    {this.renderDescription(item)}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    }

   
}

export default Sticky