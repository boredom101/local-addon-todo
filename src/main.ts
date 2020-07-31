import run from './runner';

export default function(context) {
    const { notifier, electron } : { notifier: any, electron: typeof Electron } = context;

    electron.ipcMain.on("run-todo-task", (event, site, data) => {
        run(site, data);
    });
}