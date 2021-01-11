import React from 'react';
import { connect } from 'react-redux';

  
interface IProps {
 
}

interface IState {

}


class HighlightedIndex extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    async componentDidMount() {
      
    }

    

    render() {
       
        return (
            <div className="flex">
                HighlightedIndex
            </div>
        )
    }
}

const mapDispatchToProps = {
  
}

export default connect(null, mapDispatchToProps)(HighlightedIndex);