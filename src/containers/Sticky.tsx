import React from 'react';
import { List, Input, Button } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';

import { arrayToKeyValue } from 'utils/common';
import { getListNotes, updateNote } from 'reducers/notes';


const MarkdownIt = require('markdown-it');

const { TextArea } = Input;

interface IProps {
    getListNotes: any,
    updateNote: any,
}

interface IState {
    allowEdit: boolean,
    listNotesObj: any,
}

class Sticky extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)
        this.state = {
            listNotesObj: [],
            allowEdit: false
        }
        this.sendRequest = debounce(this.sendRequest, 300)

    }

    async componentDidMount() {
        const res = await this.props.getListNotes();
        this.setState({ 
            listNotesObj: arrayToKeyValue(res.data) 
        })
     
    }

    renderDescription = (item) => {
        const { allowEdit } = this.state;
        if (allowEdit) {
            return <TextArea onChange={e => this.handleChangeInput(e, item.id)} defaultValue={item.content} />
        } else {
            return <div>{this.parseMarkdown(item.content)}</div>
        }
    }

    parseMarkdown = (data) => {
        const md = new MarkdownIt();

        return ReactHtmlParser(md.render(data))
    }

    handleChangeInput = (e, noteId) => {
        this.sendRequest(e.target.value, noteId)
    }

    sendRequest = async (content, noteId) => {
        const { listNotesObj } = this.state;
        const res = await this.props.updateNote(noteId, content);
        listNotesObj[noteId] = res.data
        this.setState({
            listNotesObj
        })
    }

    render() {
        const { listNotesObj, allowEdit } = this.state;
        const listNotesArray = Object.values(listNotesObj)

        return <div className="Sticky">
            <Button onClick={() => this.setState({ allowEdit: !allowEdit })}>Edit</Button>
            <List
                itemLayout="horizontal"
                dataSource={listNotesArray}
                renderItem={(item: any) => (
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

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = {
    getListNotes,
    updateNote
}

export default connect(mapStateToProps, mapDispatchToProps)(Sticky);
