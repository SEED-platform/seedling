import { Component } from '@angular/core';
import { ElectronService } from './core/services/electron/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import OverlayScrollbars from 'overlayscrollbars';
import { SharedService } from './core/services/shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  scrollOptions: OverlayScrollbars.Options = {
    sizeAutoCapable: false
  };

  constructor(
    public sharedService: SharedService,
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);
  }
}
