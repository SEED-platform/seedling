import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { PostgresService } from "../postgres/postgres.service";

@Injectable({
  providedIn: 'root'
})
export class TaxLotService {
  model: any;

  constructor(
    private postgresService: PostgresService,
    private electronService: ElectronService
  ) {
    this.model = postgresService.sequelize.define('tax_lot', { 
      extra_data: {
        type: electronService.DataTypes.JSONB
      },
      footprint: {
        type: electronService.DataTypes.GEOMETRY('POLYGON', 4326)
      },
      ulid: {
        type: electronService.DataTypes.STRING
      }
    }, {});
  }
}
