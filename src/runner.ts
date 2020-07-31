import { Result } from './parser';
import { SiteData, getServiceContainer, registerLightningService } from '@getflywheel/local/main';
import { SiteJSON, SiteServiceRole } from '@getflywheel/local';
import { shell } from 'electron';

export default function run(site: SiteJSON, data: Result) {
    if (data.valid) {
        if (data.type == "rename") {
            SiteData.updateSite(site.id, {name: data.arg.newOne});
        } else if (data.type == "inspect") {
            shell.openExternal("http://" + site.domain);
        } else if (data.type == "change") {
            if (data.arg.component == "php") {
                getServiceContainer().cradle.siteProvisioner.swapService(SiteData.getSite(site.id), SiteServiceRole.PHP, "php", data.arg.newOne);
            }
        }
    }
}