import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card } from 'primereact/card';

import { getRankings } from '../actions';

class Frontpage extends React.Component {

    componentDidMount() {
        this.props.getRankings();
    }

    renderCardRow() {
        return this.props.rankings.map((ranking) => {
            const header = (
                <img src="https://via.placeholder.com/300x150" alt={`${ranking.listname}`} style={{borderTopLeftRadius: ".5rem", borderTopRightRadius: ".5rem"}} />
            );
            return (
                <div className="col-12 col-sm-6 col-md-4 py-4" key={ranking.id} >
                    <Link to={`/rankings/${ranking.shortname}`}>
                        <Card title={ranking.shortname} subTitle={ranking.listname} style={{borderRadius: ".5rem"}} header={header}>
                        </Card>
                    </Link>
                </div>
            )
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="frontpage-branding">
                    <div className="jumbotron jumbotron-fluid mb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h1 className="display-3">Welcome to IceRanking</h1>
                                    <p className="lead" style={{fontSize: 32}}>A simple, modern ranking system</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-light">
                    <div className="container">
                        <div className="row align-items-center justify-content-center h-100">
                            {this.renderCardRow()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        rankings: Object.values(state.rankings)
    }
}

export default connect(mapStateToProps, { getRankings })(Frontpage);