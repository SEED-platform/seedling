import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AppConfig } from '../../../../environments/environment';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {
  private readonly _postgresDir: string;
  private _initializedSubject = new BehaviorSubject(false);
  readonly initialized$ = this._initializedSubject.asObservable().pipe(distinctUntilChanged());
  private _runningSubject = new BehaviorSubject(false);
  readonly running$ = this._runningSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone
  ) {
    this._postgresDir = electronService.path.resolve(
      electronService.remote.app.getAppPath(),
      AppConfig.environment === 'PROD' ? '../pg12/bin' : './resources/pg12/bin'
    );
    console.log(this._postgresDir);
    this._status().catch(code => {
    });
    this.running$.subscribe(running => this._connectSequelize(running));
  }

  getPostgresVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      const child = this.electronService.childProcess.spawn(this._resolve('psql'), ['--version'], {cwd: this._postgresDir});
      child.stdout.on('data', (data: string) => stdout += `${data}`);
      child.stderr.on('data', (data: string) => stderr += `${data}`);
      child.on('error', error => {
        console.error(error);
        reject();
      });
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
    let initOptions = ['-U', process.env.PGUSER];
    if (process.platform === 'darwin') {
      initOptions = initOptions.concat(['-A', 'trust']);
    }

    console.log('Initializing DB...');
    const child = this.electronService.childProcess.spawn(this._resolve('initdb'), initOptions, {cwd: this._postgresDir});

    child.stdout.on('data', (data: string) => this.ngZone.run(() => {
      data = data.toString().trim();
      console.log(`initDb stdout: '${data}'`);
      if (data.startsWith('Success. You can now start the database server using')) {
        this._initializedSubject.next(true);
      }
    }));
    child.stderr.on('data', (data: string) => {
      data = data.toString().trim();
      console.error(`initDb stderr: '${data}'`);
    });
    child.on('close', (code) => this.ngZone.run(() => {
      console.log(`initDb exited with code ${code}`);
      if (code === 0) {
        this._initializedSubject.next(true);
      }
    }));
  }

  startDb(): void {
    console.log('Starting DB...');
    const child = this.electronService.childProcess.spawn(this._resolve('pg_ctl'), ['start'], {cwd: this._postgresDir});

    child.stdout.on('data', (data: string) => this.ngZone.run(() => {
      data = data.toString().trim();
      console.log(`startDb stdout: '${data}'`);
      if (data.endsWith('server started')) {
        this._runningSubject.next(true);
      } else if (data.endsWith('database system is shut down')) {
        this._runningSubject.next(false);
      }
    }));
    child.stderr.on('data', (data: string) => {
      data = data.toString().trim();
      console.error(`startDb stderr: '${data}'`);
    });
    child.on('close', (code) => {
      console.log(`startDb exited with code ${code}`);
    });
  }

  stopDb(): void {
    console.log('Stopping DB...');
    const child = this.electronService.childProcess.spawn(this._resolve('pg_ctl'), ['stop'], {cwd: this._postgresDir});

    child.stdout.on('data', (data: string) => this.ngZone.run(() => {
      data = data.toString().trim();
      console.log(`stopDb stdout: '${data}'`);
      if (data.endsWith('server stopped')) {
        this._runningSubject.next(false);
      }
      this._kill(child.pid);
    }));
    child.stderr.on('data', (data: string) => {
      data = data.toString().trim();
      console.error(`stopDb stderr: '${data}'`);
    });
    child.on('close', (code) => {
      console.log(`stopDb exited with code ${code}`);
    });
  }

  // Resolve with boolean if running/not-running, reject with exit code if failure
  private _status(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const child = this.electronService.childProcess.spawn(this._resolve('pg_ctl'), ['status'], {cwd: this._postgresDir});
      child.stdout.on('data', (data: string) => this.ngZone.run(() => {
        data = data.toString().trim();
        console.log(`status stdous: '${data}'`);
        if (`${data}`.startsWith('pg_ctl: server is running')) {
          resolve(true);
          this._initializedSubject.next(true);
          this._runningSubject.next(true);
        } else if (data === 'pg_ctl: no server running') {
          resolve(false);
          this._initializedSubject.next(true);
          this._runningSubject.next(false);
        }
        this._kill(child.pid);
      }));
      child.stderr.on('data', (data: string) => {
        data = data.toString().trim();
        console.log(`status stderr: '${data}'`);
      });
      child.on('close', code => this.ngZone.run(() => {
        console.log(`status exited with code ${code}`);
        if (code === 3) {
          // Initialized but not running
          resolve(false);
          this._initializedSubject.next(true);
          this._runningSubject.next(false);
        } else if (code === 4) {
          reject(code);
          this._initializedSubject.next(false);
          this._runningSubject.next(false);
        }
      }));
    });
  }

  private _resolve(executable: string): string {
    return this.electronService.path.resolve(this._postgresDir, executable);
  }

  // Manually kill Windows processes
  private _kill(pid: number) {
    if (process.platform === 'win32') {
      this.electronService.childProcess.spawn('taskkill', ['/pid', String(pid), '/f', '/t']);
    }
  }

  private _connectSequelize(connect: boolean) {
    console.log('connecting!', connect);
    // new Sequelize('postgres://seeduser:supersecretpassword@127.0.0.1:5442/seed')
  }
}
