import React, { Component } from 'react';
import {
    InnerPaneSidebarContentItem,
    TextButton,
    Markdown
} from '@getflywheel/local-components';
import parse from './parser';
import { ipcRenderer } from 'electron';
import { confirm } from '@getflywheel/local/renderer';

export default class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            again: "",
            data: parse(props.text),
            site: props.site,
            text: props.text
        }
        this.clicked = this.clicked.bind(this);
    }

    clicked() {
        if (this.state.data.question && this.state.data.valid) {
            confirm({
                title: "Are you sure you want to do this?",
                buttonText: "Do This",
                topIconColor: "orange"
            }).then(() => {
                ipcRenderer.send("run-todo-task", this.state.site, this.state.data);
            });
        } else {
            ipcRenderer.send("run-todo-task", this.state.site, this.state.data);
        }
        this.setState({
            again: "Again",
            data: this.state.data,
            site: this.state.site,
            text: this.state.text
        });
    }

    render() {
        return <InnerPaneSidebarContentItem>
            <Markdown src={this.state.data.markdown}></Markdown>
            <TextButton onClick={this.clicked} disabled={!this.state.data.valid} size="tiny">Run {this.state.again}</TextButton>
            <TextButton onClick={this.props.delete} size="tiny">Delete</TextButton>
        </InnerPaneSidebarContentItem>;
    }
}