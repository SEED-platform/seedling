import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { PostgresService } from "../postgres/postgres.service";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  model: any;

  constructor(
    private postgresService: PostgresService,
    private electronService: ElectronService
  ) { 
    this.model = postgresService.sequelize.define('property', { 
      extra_data: {
        type: electronService.DataTypes.JSONB
      },
      footprint: {
        type: electronService.DataTypes.GEOMETRY('POLYGON', 4326)
      },
      long_lat: {
        type: electronService.DataTypes.GEOMETRY('POINT', 4326)
      },
      ubid: {
        type: electronService.DataTypes.STRING
      }
    }, {})
  }
}
