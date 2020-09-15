import { Component, NgZone, OnInit } from '@angular/core';
import { PostgresService } from '../core/services/postgres/postgres.service';
import { AppConfig } from '../../environments/environment';

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
    public postgresService: PostgresService,
    private ngZone: NgZone
  ) {
    this.env = AppConfig.environment;
  }

  ngOnInit(): void {
    this._getPostgresVersion();
  }

  private _getPostgresVersion() {
    this.postgresService.getPostgresVersion().stdout.on(
      'data',
      (data: string) => this.ngZone.run(() => {
        this.postgresVersion = data.toString();
      })
    );
  }
}
