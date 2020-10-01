import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import { Umzug, SequelizeStorage } from 'umzug';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as pg from 'pg';
import * as pgHstore from 'pg-hstore';
import * as Sequelize from 'sequelize';


@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  pg: typeof pg;
  pgHstore: typeof pgHstore;
  DataTypes: typeof Sequelize.DataTypes;
  Sequelize: typeof Sequelize.Sequelize;
  Umzug: typeof Umzug;
  SequelizeStorage: typeof SequelizeStorage;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      // If you want to use remote object please set enableRemoteModule to true in main.ts
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.pg = this.remote.require('pg');
      this.pgHstore = this.remote.require('pg-hstore');
      this.DataTypes = this.remote.require('sequelize').DataTypes;
      this.Sequelize = this.remote.require('sequelize').Sequelize;
      this.Umzug = this.remote.require('umzug').Umzug;
      this.SequelizeStorage = this.remote.require('umzug').SequelizeStorage;

      // Initialize .env variables
      require('dotenv').config({
        path: this.path.resolve(this.remote.app.getAppPath(), '.env')
      })
    }
  }
}
