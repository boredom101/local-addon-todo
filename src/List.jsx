import React, { Component } from 'react';
import {
    InnerPaneSidebar,
    InnerPaneSidebarHeader,
    InnerPaneSidebarContent
} from '@getflywheel/local-components';
import { confirm } from '@getflywheel/local/renderer';
import Task from './Task';
import { ipcRenderer } from 'electron';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaValue: '',
            items: this.fetchTasks()
        };
        this.onTextareaChange = this.onTextareaChange.bind(this);
		this.onTextareaKeyPress = this.onTextareaKeyPress.bind(this);
    }

    addTask(text) {
        const items = this.state.items.concat([{text: text}]);
        this.setState({items: items, textareaValue: ''}, this.syncTasks);
    }

    onTextareaChange(event) {
		this.setState({
			textareaValue: event.target.value,
		});
    }

    syncTasks() {
        ipcRenderer.send("save-todo-list", this.props.site.id, this.state.items);
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
            }, this.syncTasks);
        });
    }
    
    fetchTasks() {
        return this.props.site.todo || [];
    }

    componentDidUpdate(previousProps) {
		if (previousProps.site.id !== this.props.site.id) {
			this.setState({
				items: this.fetchTasks(),
			});
		}
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