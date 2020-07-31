import List from './List';

export default function(context) {
    const { React, hooks } = context;
    hooks.addContent('SiteInfoOverview', (site) => <List site={site} />);
}