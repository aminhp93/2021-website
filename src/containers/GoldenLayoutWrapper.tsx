import React from 'react';
import ReactDOM from 'react-dom'

import GoldenLayout from 'golden-layout';
import { Provider } from 'react-redux';
import store from 'store';

import Sticky from './Sticky';

window.React = React;
window.ReactDOM = ReactDOM;


class GoldenLayoutWrapper extends React.Component {
    layout: any;

    render() {
        return null
    }

    componentDidMount() {
        setTimeout(() => {

        const config = {
            content: [
                {
                    type: 'row',
                    content:[
                        {
                            type: 'column',
                            width: 30,
                            content:[
                                {
                                    type: 'react-component',
                                    component: 'Sticky',
                                    title: 'Note 1',
                                    props: { nodeId: 2, bgColor: 'bg-light-pink' }
                                },
                                {
                                    type: 'react-component',
                                    component: 'Sticky',
                                    title: 'Note 2',
                                    props: { nodeId: 9, bgColor: 'bg-light-blue' }
                                },
                            ]
                        },
                        {
                            type: 'column',
                            width: 40,
                            content:[
                                {
                                    type: 'react-component',
                                    component: 'Sticky',
                                    title: 'Note 3',
                                    props: { nodeId: 10, bgColor: 'bg-light-yellow' }
                                },
                            ]
                        },
                        {
                            type: 'column',
                            width: 30,
                            content:[
                                {
                                    type: 'react-component',
                                    component: 'Sticky',
                                    title: 'Note 4',
                                    props: { nodeId: 11, bgColor: 'bg-gray' }
                                },
                            ]
                        }
                    ]
                }
            ]
        };

        function wrapComponent(Component) {
            class Wrapped extends React.Component {
                render() {
                    return (
                        <Provider store={store}>
                            <Component {...this.props}/>
                        </Provider>
                    );
                }
            }
            return Wrapped;
        };

        const myLayout = new GoldenLayout( config, this.layout );

        myLayout.registerComponent('Sticky', wrapComponent(Sticky));

        myLayout.init();

        window.addEventListener('resize', () => {
            myLayout.updateSize();
        });
    },0)
    }
}

export default GoldenLayoutWrapper