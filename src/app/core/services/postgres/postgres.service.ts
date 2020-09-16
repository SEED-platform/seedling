import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AppConfig } from '../../../../environments/environment';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {
  private readonly _postgresDir: string;
  private _runningSubject = new BehaviorSubject(false);
  readonly running$ = this._runningSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private electronService: ElectronService
  ) {
    this._postgresDir = electronService.path.resolve(
      electronService.remote.app.getAppPath(),
      AppConfig.environment === 'PROD' ? '../pg12/bin' : './resources/pg12/bin'
    );
    console.log(this._postgresDir);
  }

  getPostgresVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      const child = this.electronService.childProcess.spawn(this._resolve('psql'), ['--version'], {cwd: this._postgresDir});
      child.stdout.on('data', (data: string) => stdout += `${data}`);
      child.stderr.on('data', (data: string) => stderr += `${data}`);
      child.on('close', code => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(stderr.trim());
        }
      });
    });
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
      this._resolve('initdb'),
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
      this._resolve('pg_ctl'),
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
      this._resolve('pg_ctl'),
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

  status(): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = this.electronService.childProcess.spawn(this._resolve('pg_ctl'), ['status'], {cwd: this._postgresDir});
      child.stdout.on('data', (data: string) => {
        if (`${data}`.startsWith('pg_ctl: server is running')) {
          console.log('resolving');
          resolve();
          console.log('killing', child.pid);
          this._kill(child.pid);
        }
      });
      child.stderr.on('data', (data: string) => {
        console.log(`GOT STDERR: ${data}`);
      });
      child.on('close', code => {
        console.log('CLOSE', code);
        if (code !== 0) {
          reject();
        }
      });
    });
  }

  private _resolve(executable: string): string {
    return this.electronService.path.resolve(this._postgresDir, executable);
  }

  private _kill(pid: number) {
    this.electronService.childProcess.spawn('taskkill', ['/pid', String(pid), '/f', '/t']);
  }
}
