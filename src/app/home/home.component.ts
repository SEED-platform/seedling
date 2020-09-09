import {Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from "../core/services";
import {AppConfig} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  directoryContents: string[];
  postgresVersion: string;
  readonly env: string;
  private readonly _postgresDir: string;

  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone
  ) {
    this.env = AppConfig.environment;
    this._postgresDir = electronService.path.join(electronService.path.dirname('./'), 'resources', 'pg12', 'bin');
  }

  ngOnInit(): void {
    this.electronService.fs.promises.readdir(this._postgresDir).then(result => {
      this.directoryContents = result;
    });

    this._getPostgresVersion();
  }

  private _getPostgresVersion() {
    const child = this.electronService.childProcess.spawn('psql', ['--version'], {cwd: this._postgresDir})
    child.stdout.on('data', (data: string) => this.ngZone.run(() => {
      this.postgresVersion = data;
    }));
    child.stderr.on('data', (data: string) => {
      console.error(`stderr: ${data}`);
    });
    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

}
