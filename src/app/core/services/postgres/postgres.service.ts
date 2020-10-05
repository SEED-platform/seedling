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
  private _pendingSubject = new BehaviorSubject(true);
  readonly pending$ = this._pendingSubject.asObservable().pipe(distinctUntilChanged());
  sequelize = new this.electronService.Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: '127.0.0.1',
    port: Number(process.env.PGPORT),
    dialect: 'postgres',
    dialectModule: this.electronService.pg
  });
  private _umzug = new this.electronService.Umzug({
    migrations: {
      path: this.electronService.path.resolve(this.electronService.remote.app.getAppPath(), 'server', 'migrations'),
      params: [
        this.sequelize.getQueryInterface()
      ]
    },
    storage: new this.electronService.SequelizeStorage({ sequelize: this.sequelize})
  });

  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone
  ) {
    this._postgresDir = electronService.path.resolve(
      electronService.remote.app.getAppPath(),
      AppConfig.environment === 'PROD' ? '../pg12/bin' : './resources/pg12/bin'
    );
    this._status().finally(async () => {
      const running = this._runningSubject.value;
      const initialized = this._initializedSubject.value;
      console.warn('RUNNING:', running);
      console.warn('INITIALIZED:', initialized);
      if (!initialized) {
        await this.initDb();
        await this.startDb();
        await this._createDb();
        await this._psql('DROP DATABASE postgres;');
        await this._psql(`ALTER ROLE ${process.env.PGUSER} WITH PASSWORD '${process.env.PGPASSWORD}';`);
        await this._psql('CREATE EXTENSION postgis;');
      }
      this._pendingSubject.next(false);
      this.running$.subscribe(async (running) => {
        if (running) {
          await this._checkMigrations();
        }
      });
    });
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

  // resolve if exit code === 0
  initDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._pendingSubject.next(true);
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
          resolve();
        } else {
          reject();
        }
      }));
    });
  }

  // resolve if exit code === 0
  private _createDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Creating DB...');
      const child = this.electronService.childProcess.spawn(this._resolve('createdb'), {cwd: this._postgresDir});

      child.stdout.on('data', (data: string) => this.ngZone.run(() => {
        data = data.toString().trim();
        console.log(`createDb stdout: '${data}'`);
      }));
      child.stderr.on('data', (data: string) => {
        data = data.toString().trim();
        console.error(`createDb stderr: '${data}'`);
      });
      child.on('close', (code) => this.ngZone.run(() => {
        console.log(`createDb exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      }));
    });
  }

  // resolve if exit code === 0
  private _psql(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('psql', query);
      const child = this.electronService.childProcess.spawn(this._resolve('psql'), ['-c', query], {cwd: this._postgresDir});

      child.stdout.on('data', (data: string) => this.ngZone.run(() => {
        data = data.toString().trim();
        console.log(`psql stdout: '${data}'`);
        this._kill(child.pid);
      }));
      child.stderr.on('data', (data: string) => {
        data = data.toString().trim();
        console.error(`psql stderr: '${data}'`);
      });
      child.on('close', (code) => this.ngZone.run(() => {
        console.log(`psql exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      }));
    });
  }

  // resolve if exit code === 0
  returnPsql(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('psql', query);
      const child = this.electronService.childProcess.spawn(this._resolve('psql'), ['-c', query], {cwd: this._postgresDir});

      child.stdout.on('data', (data: string) => this.ngZone.run(() => {
        data = data.toString().trim();
        console.log(`psql stdout: '${data}'`);
        this._kill(child.pid);
        resolve(data)
      }));
      child.stderr.on('data', (data: string) => {
        data = data.toString().trim();
        console.error(`psql stderr: '${data}'`);
        reject(data)
      });
      child.on('close', (code) => this.ngZone.run(() => {
        console.log(`psql exited with code ${code}`);
        if (code === 0) {
          resolve(code.toString());
        } else {
          reject(code.toString());
        }
      }));
    });
  }

  // resolve once started, reject if failure to start
  startDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Starting DB...');
      const child = this.electronService.childProcess.spawn(this._resolve('pg_ctl'), ['start', '--wait'], {cwd: this._postgresDir});

      child.stdout.on('data', (data: string) => this.ngZone.run(() => {
        data = data.toString().trim();
        console.log(`startDb stdout: '${data}'`);
        if (data.endsWith('server started')) {
          this._runningSubject.next(true);
          resolve();
        } else if (data.endsWith('database system is shut down')) {
          this._runningSubject.next(false);
          reject();
        }
      }));
      child.stderr.on('data', (data: string) => {
        data = data.toString().trim();
        console.error(`startDb stderr: '${data}'`);
      });
      child.on('close', (code) => {
        console.log(`startDb exited with code ${code}`);
      });
    });
  }

  _checkMigrations(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._umzug.pending().then(async (migrations) => {
        if (migrations.length) {
          await this._umzug.up();
        }
        resolve();
      }).catch((err: string) => {
        console.error(`There was an error looking for migrations: ${err}`)
        reject(err);
      })
    })
  }

  stopDb(): void {
    console.log('Stopping DB...');
    const child = this.electronService.childProcess.spawn(this._resolve('pg_ctl'), ['stop', '--wait'], {cwd: this._postgresDir});

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
      if (data.endsWith('Is server running?')) {
        this._runningSubject.next(false);
      }
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
        console.log(`status stdout: '${data}'`);
        if (`${data}`.startsWith('pg_ctl: server is running')) {
          this._initializedSubject.next(true);
          this._runningSubject.next(true);
          resolve(true);
        } else if (data === 'pg_ctl: no server running') {
          this._initializedSubject.next(true);
          this._runningSubject.next(false);
          resolve(false);
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
          this._initializedSubject.next(true);
          this._runningSubject.next(false);
          resolve(false);
        } else if (code === 4) {
          this._initializedSubject.next(false);
          this._runningSubject.next(false);
          reject(code);
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
}
