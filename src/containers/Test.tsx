import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getListUrlGoValue } from 'reducers/stocks';

interface IProps {
    getListUrlGoValue: any,
}

interface IState {
    listUrl: any,
}

class Test extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            listUrl: []
        }
    }
    async componentDidMount() {
        const res = await this.props.getListUrlGoValue();
        if (!res.data.results) return;
        this.setState({ 
            listUrl: res.data.results.sort((a,b) => b.idea_id - a.idea_id)
        })
    }

    render() {
        const { listUrl } = this.state;
        
        return (
            <div>
                {listUrl.map(i => {
                    const slug = 'https://app.govalue.vn/' + i.slug
                    return <div><a href={slug} target="_blank">{i.idea_id} - {moment(i.create_date).format('YYYY-MM-DD')} - {slug}</a></div>
                })}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = {
    getListUrlGoValue
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);