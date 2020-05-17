import React from 'react'
import { withRouter } from 'react-router';

import api from '../../apis/ranking';

import { AutoComplete } from 'primereact/autocomplete';

import SearchItem from './SearchItem';
import { Button } from 'primereact/button';

class SearchBar extends React.Component {
    state = {
        searchTerm: "",
        suggestions: [],
    }

    search(term) {
        api.get('/search', {
            params: {
                term: term
            }
        }).then(({data, status}) => {
            const results = data.data.map(result => {
                if (result._links.self.includes("rankings")) {
                    return {
                        listName: result.listname,
                        secondaryText: result.shortname,
                        type: "ranking",
                        link: `/rankings/${result.shortname}`
                    }
                }
                if (result._links.self.includes("riders")) {
                    return {
                        listName: `${result.firstname} ${result.lastname}`,
                        secondaryText: "32 resultater",
                        type: "rider",
                        link: `/rider/${result.id}`
                    }
                }
                if (result._links.self.includes("horses")) {
                    return {
                        listName: result.horse_name,
                        secondaryText: result.feif_id,
                        type: "horse",
                        link: `/horse/${result.feif_id}`
                    }
                }
                if (result._links.self.includes("competitions")) {
                    return {
                        listName: result.name,
                        secondaryText: `${result.first_date} - ${result.last_date}`,
                        type: "competition",
                        link: `/competition/${result.id}`
                    }
                }

                return {};
            })
            this.setState({suggestions: results});
        });

    }

    getTemplate(item) {

    }

    render() {
        return (
            <>
                <AutoComplete
                    className={`${this.props.show ? 'show' : ''}`}
                    field="listName" 
                    placeholder="Search for rankings, horses, riders and competitions..." 
                    scrollHeight={"400px"}
                    minLength={3}
                    itemTemplate={SearchItem}
                    suggestions={this.state.suggestions} 
                    value={this.state.searchTerm} 
                    
                    completeMethod={(e) => this.search(e.query)}
                    onChange={(e) => this.setState({searchTerm: e.value})} 
                    onSelect={(e) => {
                        this.props.history.push(e.value.link);
                        this.setState({searchTerm: ""});
                    }}
                />
                <Button label="" icon="pi pi-times" className={`d-block d-md-none hide-search ${this.props.show ? 'show' : ''}`} onClick={this.props.onHide}></Button>
            </>
        );
    }
}

export default withRouter(SearchBar);