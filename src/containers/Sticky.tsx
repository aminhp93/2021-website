import React from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import {
    EditOutlined,
    EyeOutlined
} from '@ant-design/icons';

import { getListNotes, updateNote, getNote } from 'reducers/notes';

const MarkdownIt = require('markdown-it');
const { TextArea } = Input;

interface IProps {
    getListNotes: any,
    updateNote: any,
    getNote: any,
    nodeId: number,
    bgColor: string,
}

interface IState {
    allowEdit: boolean,
    noteObj: any,
}

class Sticky extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            noteObj: {},
            allowEdit: false
        }
        this.sendRequest = debounce(this.sendRequest, 300)

    }

    async componentDidMount() {        
        const res = await this.props.getNote(this.props.nodeId);
        this.setState({ 
            noteObj: res.data
        })
     
    }

    renderDescription = (item) => {
        const { allowEdit } = this.state;
        if (allowEdit) {
            return <TextArea onChange={e => this.handleChangeInput(e, item.id)} defaultValue={item.content}/>
        } else {
            return <div>{this.parseMarkdown(item.content)}</div>
        }
    }

    parseMarkdown = (data) => {
        const md = new MarkdownIt();
        return ReactHtmlParser(md.render(String(data)))
    }

    handleChangeInput = (e, noteId) => {
        this.setState({ 

        })
        this.sendRequest(e.target.value, noteId)
    }

    sendRequest = async (content, noteId) => {
        const res = await this.props.updateNote(noteId, content);
        this.setState({
            noteObj: res.data
        })
    }

    render() {
        const { noteObj, allowEdit } = this.state;
        const { bgColor } = this.props;

        return <div className={`Sticky ${bgColor}`}>
            <div className="Sticky-allow-edit" onClick={() => this.setState({ allowEdit: !allowEdit })}>{!allowEdit ? <EditOutlined className="medium"/> : <EyeOutlined className="medium"/> }</div>
            {this.renderDescription(noteObj)}
        </div>
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = {
    getListNotes,
    updateNote,
    getNote
}

export default connect(mapStateToProps, mapDispatchToProps)(Sticky);
