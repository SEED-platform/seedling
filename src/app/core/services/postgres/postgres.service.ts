import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { AppConfig } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {
  private readonly _postgresDir: string;

  constructor(
    private electronService: ElectronService
  ) {
    this._postgresDir = electronService.path.resolve(
      electronService.remote.app.getAppPath(),
      AppConfig.environment === 'PROD' ? '../pg12/bin' : './resources/pg12/bin'
    );
    console.log(this._postgresDir);
  }

  getPostgresVersion(): any {
    return this.electronService.childProcess.spawn(
      this.electronService.path.resolve(this._postgresDir, 'psql'),
      ['--version'],
      {cwd: this._postgresDir}
    );
  }

  initDb(): void {
    let initOptions: string[] = [];
    if (process.platform === 'win32') {
      initOptions = ['-U', process.env.PGUSER];
    } else if (process.platform === 'darwin') {
      initOptions = ['-U', process.env.PGUSER, '-A', 'trust'];
    }

    console.log('Initializing DB...');
    const child = this.electronService.childProcess.spawn(
      this.electronService.path.resolve(this._postgresDir, 'initdb'),
      initOptions,
      {cwd: this._postgresDir}
    );

    child.stdout.on('data', (data: string) => {
      console.log('initDb data:', data.toString());
      return data.toString();
    });
    child.stderr.on('data', (data: string) => {
      console.error(`initDb stderr: ${data}`);
      return data;
    });
    child.on('close', (code) => {
      console.log(`initDb exited with code ${code}`);
      return code;
    });
  }

  startDb(): void {
    console.log('Starting DB...');
    const child = this.electronService.childProcess.spawn(
      this.electronService.path.resolve(this._postgresDir, 'pg_ctl'),
      ['start'],
      {cwd: this._postgresDir}
    );

    child.stdout.on('data', (data: string) => {
      console.log('startDb data:', data.toString());
      return data.toString();
    });
    child.stderr.on('data', (data: string) => {
      console.error(`startDb stderr: ${data}`);
      return data;
    });
    child.on('close', (code) => {
      console.log(`startDb exited with code ${code}`);
      return code;
    });
  }

  stopDb(): void {
    console.log('Stopping DB...');
    const child = this.electronService.childProcess.spawn(
      this.electronService.path.resolve(this._postgresDir, 'pg_ctl'),
      ['stop'],
      {cwd: this._postgresDir}
    );

    child.stdout.on('data', (data: string) => {
      console.log('stopDb data:', data.toString());
      return data.toString();
    });
    child.stderr.on('data', (data: string) => {
      console.error(`stopDb stderr: ${data}`);
      return data;
    });
    child.on('close', (code) => {
      console.log(`stopDb exited with code ${code}`);
      return code;
    });
  }


}
