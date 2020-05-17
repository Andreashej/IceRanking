import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import RankingCard from './RankingList/RankingCard';

import { getRankings } from '../actions';

class Frontpage extends React.Component {

    componentDidMount() {
        this.props.getRankings();
    }

    renderCardRow() {
        return this.props.rankings.map((ranking) => {
            return (
                <div className="col-12 col-sm-6 col-md-4 py-4" key={ranking.id} >
                    <Link to={`/rankings/${ranking.shortname}`}>
                        <RankingCard ranking={ranking} />
                    </Link>
                </div>
            )
        });
    }

    render() {
        return (
            <React.Fragment>
                <section className="frontpage-branding">
                    <div className="jumbotron jumbotron-fluid mb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h1 className="display-3">Welcome to IceRanking</h1>
                                    <hr className="stylish-line" />
                                    <p className="lead" style={{fontSize: "2rem"}}>A simple, modern ranking system</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="container-fluid bg-light">
                    <div className="container">
                        <div className="row align-items-center justify-content-center h-100">
                            {this.renderCardRow()}
                        </div>
                    </div>
                </section>
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