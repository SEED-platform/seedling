import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { PostgresService } from '../core/services/postgres/postgres.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  directoryContents: string[];
  postgresVersion: string;
  readonly env: string;

  latestQueryResult = '';  

  constructor(
    public postgresService: PostgresService
  ) {
    this.env = AppConfig.environment;
  }

  ngOnInit(): void {
    this._getPostgresVersion();
  }

  private _getPostgresVersion() {
    this.postgresService.getPostgresVersion()
      .then(version => this.postgresVersion = version)
      .catch(() => this.postgresVersion = "Postgres not installed correctly.");
  }

  clearQueryResult(): void {
    this.latestQueryResult = '';
  }

  returnPsql():void {    
    this.latestQueryResult = '...';
    this.postgresService.returnPsql('SELECT postgis_full_version();')
      .then(data => this.latestQueryResult = data)
      .catch(data => this.latestQueryResult = data);
  }
}
