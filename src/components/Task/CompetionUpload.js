// import React from 'react';
// import { FileUpload } from 'primereact/fileupload'
// import competitionService from '../../services/v1/competition.service';
// import { TaskBar } from './TaskBar';

// class CompetitionUpload extends React.Component {
//     state = {
//         task: null
//     };

//     ref;
//     uploadResult(event) {
//         const expectedFilename = `${this.props.competitionId}.txt`;
//         if (expectedFilename.toLowerCase() !== event.files[0].name.toLowerCase()) {
//             alert(`Filename must be ${expectedFilename}`);
//             this.ref.current.clear();
//             return;
//         }

//         competitionService.uploadResults(event.files).then(tasks => {
//             tasks.map(task => {
//                 console.log(task);
//                 if(task.id) {
//                     this.setState({
//                         task
//                     });
//                 }
//                 return task;
//             });
//         })
//     }

//     render() {
//         if (this.state.task) {
//             return <TaskBar taskId={this.state.task} onComplete={this.props.onComplete} />
//         }

//         return <FileUpload ref={this.ref} mode="basic" customUpload uploadHandler={(e) => this.uploadResult(e)} />
//     }
// }

// export default CompetitionUpload;