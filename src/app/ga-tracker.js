import React from 'react';
import GoogleAnalytics from 'react-ga';

//init
GoogleAnalytics.initialize('UA-121334932-1');

const Tracker = (WrappedComponent ,props, options = {}) => {
    const trackPage = page => {
        GoogleAnalytics.set({
            page,
            ...options,
        });
        GoogleAnalytics.pageview(page);
    }

    const HOC = class extends React.Component {
        componentDidMount() {
            const page = this.props.location.pathname;
            trackPage(page);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if(currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }
            

            render() {
                return <WrappedComponent {...this.props} {...props}/>;
            }
        };

        return HOC;
};

export default Tracker;