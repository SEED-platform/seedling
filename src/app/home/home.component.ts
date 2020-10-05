import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../environments/environment';
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
  readonly env: string;

  latestQueryResult = '';  

  constructor(
    public postgresService: PostgresService,
    private propertyService: PropertyService,
    private taxlotService: TaxLotService
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

  async testButton() {
    // this.propertyService.model.create({
    //   footprint: { 
    //     type: 'Polygon',
    //     coordinates: [
    //       [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    //     ],
    //     crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    //   }
    // }).catch((err) => { 
    //   console.log(err);
    // });
    const property = await this.propertyService.model.findByPk(2)
    property.footprint.coordinates

    // this.taxlotService.model.create({
    //   footprint: { 
    //     type: 'Polygon',
    //     coordinates: [
    //       [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    //     ],
    //     crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    //   }
    // }).catch((err) => { 
    //   console.log(err);
    // });

    debugger;
  }
}
