import React, { Component } from 'react';
import {
    InnerPaneSidebar,
    InnerPaneSidebarHeader,
    InnerPaneSidebarAddNew,
    InnerPaneSidebarContent
} from '@getflywheel/local-components';
import { confirm } from '@getflywheel/local/renderer';
import Task from './Task';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaValue: '',
            items: []
        };
        this.onTextareaChange = this.onTextareaChange.bind(this);
		this.onTextareaKeyPress = this.onTextareaKeyPress.bind(this);
    }

    addTask(text) {
        const items = this.state.items.concat([{text: text}]);
        this.setState({items: items, textareaValue: ''});
    }

    onTextareaChange(event) {
		this.setState({
			textareaValue: event.target.value,
		});
    }
    
    onTextareaKeyPress(event) {
		if (event.key !== 'Enter' || event.altKey || event.shiftKey) {
			return;
		}
		event.preventDefault();
		this.addTask(this.state.textareaValue);
    }
    
    delete(item) {
        confirm({
			title: 'Are you sure you want to delete this task?',
			buttonText: 'Delete Task',
			topIconColor: 'Orange',
		}).then(() => {
            var items = this.state.items;
            items.splice(items.findIndex((value) => value.text == item.text), 1);
            this.setState({
                items: items
            })
        });
    }

    render() {
        return <InnerPaneSidebar>
            <InnerPaneSidebarHeader title="Todo List"></InnerPaneSidebarHeader>
            <input type="text" placeholder="Add a task..." value={this.state.textareaValue} onChange={this.onTextareaChange}
            onKeyPress={this.onTextareaKeyPress} />
            <InnerPaneSidebarContent>
                {this.state.items.map(item => <Task key={item.text} delete={() => this.delete(item)} text={item.text} site={this.props.site} />)}
            </InnerPaneSidebarContent>
        </InnerPaneSidebar>;
    }
}