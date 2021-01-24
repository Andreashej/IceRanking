import React from 'react';
import { connect } from 'react-redux';
import { getTask } from '../../actions';

import { ProgressBar } from 'primereact/progressbar';

class TaskBar extends React.Component {
    interval;

    componentDidMount() {
        this.interval = setInterval(() => {
            this.props.getTask(this.props.taskId);
        }, 1000);
    }

    componentDidUpdate() {
        if (this.props.task && this.props.task.complete) {
            clearInterval(this.interval);
            if (this.props.onComplete) {
                this.props.onComplete();
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let progress = 0;

        if (this.props.task) {
            progress = this.props.task.progress;
        }

        return <ProgressBar value={progress} color="#374785" />
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        task: state.tasks[ownProps.taskId]
    }
}

export default connect(mapStateToProps, { getTask })(TaskBar);