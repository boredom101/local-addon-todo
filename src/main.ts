import run from './runner';
import { SiteData } from '@getflywheel/local/main';

export default function(context) {
    const { notifier, electron } : { notifier: any, electron: typeof Electron } = context;

    electron.ipcMain.on("run-todo-task", (event, site, data) => {
        run(site, data);
    });
    electron.ipcMain.on("save-todo-list", (event, site, data) => {
        SiteData.updateSite(site, {
            id: site,
            todo: data
        })
    });
}