import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      process.env.PGDATABASE = 'seed';
      process.env.PGUSER = 'seeduser';
      process.env.PGPORT = '5442';

      let basePath;
      if (process.platform === 'win32') {
        basePath = electronService.path.resolve(process.env.ProgramData);
      } else if (process.platform === 'darwin') {
        basePath = electronService.path.resolve(`${process.env.HOME}/Library/Application Support/`);
      }
      process.env.PGDATA = electronService.path.join(basePath, 'SEED-Platform', AppConfig.environment, 'pg12');

      console.log('process.env', process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
      console.log('NodeJS path', this.electronService.path);
    } else {
      console.log('Run in browser');
    }
  }
}
