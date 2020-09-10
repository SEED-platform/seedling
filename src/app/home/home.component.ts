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
    this._postgresDir = electronService.path.resolve(
      electronService.remote.app.getAppPath(),
      '../resources/pg12/bin'
    );
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

  initDb() {
    console.log('Initializing DB...');
    const child = this.electronService.childProcess.spawn('initdb', ['-U', process.env.PGUSER], {cwd: this._postgresDir})
    // child.stdout.on('data', (data: string) => {
    //   console.log('initDb data:', data.toString());
    // });
    // child.stderr.on('data', (data: string) => {
    //   console.error(`initDb stderr: ${data}`);
    // });
    child.on('close', (code) => {
      console.log(`initDb exited with code ${code}`);
    });
  }

  startDb() {
    console.log('Starting DB...');
    const child = this.electronService.childProcess.spawn('pg_ctl', ['start'], {cwd: this._postgresDir})
    child.stdout.on('data', (data: string) => {
      console.log('startDb data:', data.toString());
    });
    child.stderr.on('data', (data: string) => {
      console.error(`startDb stderr: ${data}`);
    });
    child.on('close', (code) => {
      console.log(`startDb exited with code ${code}`);
    });
  }

  stopDb() {
    console.log('Stopping DB...');
    const child = this.electronService.childProcess.spawn('pg_ctl', ['stop'], {cwd: this._postgresDir})
    child.stdout.on('data', (data: string) => {
      console.log('stopDb data:', data.toString());
    });
    child.stderr.on('data', (data: string) => {
      console.error(`stopDb stderr: ${data}`);
    });
    child.on('close', (code) => {
      console.log(`stopDb exited with code ${code}`);
    });
  }
}
