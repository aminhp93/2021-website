import React from 'react';
import { connect } from 'react-redux';
import { get, debounce } from 'lodash';
import { Input } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import {
    EditOutlined,
    EyeOutlined
} from '@ant-design/icons';

import { updateStock } from 'reducers/stocks';

const MarkdownIt = require('markdown-it');
const { TextArea } = Input;

interface IProps {
    symbol: any,
    stocks: any,
    updateStock: any,
}

interface IState {
    allowEdit: boolean,
    symbolObj: any,
}

class FinalAnalysis extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        const { symbol, stocks } = this.props;
        const symbolObj: any = Object.values(stocks).filter((i: any) => i.Symbol === symbol)[0] || {}
        this.state = {
            allowEdit: false,
            symbolObj
        }

        this.sendRequest = debounce(this.sendRequest, 300)
    }

    update = (e) => {
        const { symbolObj } = this.state;
        const data = {
            id: symbolObj.id,
            Note: e.target.value
        }
        this.sendRequest(data);
    }

    sendRequest = async (data) => {
        const { updateStock } = this.props;
        const res = await updateStock(data)
        this.setState({
            symbolObj: res.data
        })
    }

    parseMarkdown = (data) => {
        const md = new MarkdownIt();
        return ReactHtmlParser(md.render(String(data)))
    }

    render() {
        const { allowEdit, symbolObj } = this.state;
        const note = (symbolObj || {}).Note || ''
        return (
            <div className="FinalAnalysis">
                {
                    allowEdit
                        ? <TextArea onChange={(e) => this.update(e)} defaultValue={note}></TextArea>
                        : <div className="FinalAnalysis-note">{this.parseMarkdown(note)}</div>
                }

                <div className="FinalAnalysis-preview" onClick={() => this.setState({ allowEdit: !allowEdit })}>{allowEdit ? <EditOutlined className="medium"/> : <EyeOutlined className="medium"/> }</div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        stocks: get(state, 'stocks'),
    }
}

const mapDispatchToProps = {
    updateStock
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalAnalysis);


