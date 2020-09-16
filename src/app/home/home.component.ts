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

  constructor(
    public postgresService: PostgresService
  ) {
    this.env = AppConfig.environment;
  }

  ngOnInit(): void {
    this._getPostgresVersion();
  }

  private _getPostgresVersion() {
    this.postgresService.getPostgresVersion().then(version => this.postgresVersion = version);
  }
}
