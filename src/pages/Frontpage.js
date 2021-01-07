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
                <div className="jumbotron bg-light border-blue border-bottom border-primary mb-0" key={ranking.id}> 
                    <div className="container">
                        <div class="row">
                            <div class="col-auto">
                                <img className="logo" src={ranking.logo} style={{ width: 150 }} />
                            </div>
                            <div class="col">
                                <h2 className="display-4">{ranking.shortname}</h2>
                                <p className="lead">{ranking.listname}</p>
                                <Link to={`/rankings/${ranking.shortname}`} className="btn btn-primary">
                                    Go to ranking list
                                </Link>
                            </div>
                        </div>
                    </div>
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
                                    <h1 className="display-3">Welcome to IceCompass Rankings</h1>
                                    <hr className="stylish-line" />
                                    <p className="lead" style={{fontSize: "2rem"}}>A simple, modern ranking system</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="container-fluid bg-light px-0">
                    {this.renderCardRow()}
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