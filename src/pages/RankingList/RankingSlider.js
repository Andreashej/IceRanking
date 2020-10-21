import React from 'react';
import { connect } from 'react-redux';

import { getRankings } from '../../actions';

class RankingSlider extends React.Component {
    state = { currentSlide: 0 }

    componentDidMount() {
        this.props.getRankings();
    }
    
    setActiveSlide(slidenumber) {
        let newSlide = slidenumber;
        newSlide = newSlide < 0 ? this.props.rankings.length - 1 : newSlide;
        newSlide = newSlide > this.props.rankings.length - 1 ? 0 : newSlide;

        console.log(newSlide);

        this.setState({
            currentSlide: newSlide
        });
    }

    renderIndicators() {
        const indicators = this.props.rankings.map((ranking, i) => {
            return (
                <li key={ranking.id} className={this.state.currentSlide === i ? "active" : null} onClick={() => this.setActiveSlide(i)}></li>
            );
        });

        return (
            <ol className="carousel-indicators">
                {indicators}
            </ol>
        );
    }

    renderItems() {
        return this.props.rankings.map((ranking, i) => {
            return (
                <div className={`carousel-item ${this.state.currentSlide === i ? "active" : null}`} key={ranking.shortname}>
                    <img src={`https://via.placeholder.com/2000x1000?text=${ranking.listname.replace(" ", "+")}`} className="d-block w-100" />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="carousel slide">
                {this.renderIndicators()}
                <div className="carousel-inner">
                    {this.renderItems()}
                </div>
                <a className="carousel-control-prev" onClick={() => this.setActiveSlide(this.state.currentSlide - 1)}>
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" onClick={() => this.setActiveSlide(this.state.currentSlide + 1)}>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        rankings: Object.values(state.rankings)
    }
}

export default connect(mapStateToProps, { getRankings })(RankingSlider);