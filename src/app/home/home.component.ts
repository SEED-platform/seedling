import { Component, OnInit } from '@angular/core';
import { PostgresService } from '../core/services/postgres/postgres.service';
import { PropertyService } from '../core/services/property/property.service';
import { TaxLotService } from '../core/services/tax-lot/tax-lot.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  directoryContents: string[];
  postgresVersion: string;

  latestQueryResult = '';  

  constructor(
    public postgresService: PostgresService,
    private propertyService: PropertyService,
    private taxlotService: TaxLotService
  ) { }

  ngOnInit(): void {
    this._getPostgresVersion();
  }

  private _getPostgresVersion() {
    this.postgresService.getPostgresVersion()
      .then(version => this.postgresVersion = version)
      .catch(() => this.postgresVersion = "Postgres not installed correctly.");
  }
}
