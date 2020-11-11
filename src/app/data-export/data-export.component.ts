import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/core/services/electron/electron.service';
import { PostgresService } from 'app/core/services/postgres/postgres.service';
import { PropertyService } from 'app/core/services/property/property.service';


@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {

  constructor(
    public postgresService: PostgresService,
    public propertyService: PropertyService,
    public electronService: ElectronService
  ) { }

  ngOnInit(): void {
  }
  
  exportProperties(): void {
    this.electronService.remote.dialog.showSaveDialog(
      {filters: [{ name: 'GeoJSON', extensions: ['geojson'] }]}
    ).then(async file => {
      if (file) {
        const export_stream = this.electronService.fs.createWriteStream(file.filePath);

        export_stream.write('{ "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "EPSG:4326" } }, "features": [')
        const count = await this.propertyService.model.count();
        
        const batch_size = 50;
        const batch_count = Math.floor(count / batch_size) || 1;
        // Assigning this to a variable to call this out. Maybe this is a user input in the future?
        const parcel_num_key = 'PARCELNUM';

        for (let index = 0; index <= batch_count; index++) {
          // If not first batch, add a a comma to concat records.
          if (index != 0) export_stream.write(', ')

          // LEFT JOIN properties with tax lots on footprint intersections and capture parcel number
          const db_batch = await this.postgresService.sequelize.query(
            `SELECT tax_lots.extra_data->'${parcel_num_key}' as parcel_num, properties.* FROM properties LEFT JOIN tax_lots ON ST_Intersects(properties.footprint, tax_lots.footprint) ORDER BY parcel_num, properties.id LIMIT ${batch_size} OFFSET ${index * batch_size};`,
            { type: this.electronService.QueryTypes.SELECT }
          )

          // Reformat each for GeoJSON
          const batch = db_batch.map(db_obj => {
            const batch_obj = {
              type: "Feature",
              geometry: db_obj['footprint'],
              properties: Object.assign({}, db_obj, db_obj['extra_data']),
            }

            delete batch_obj.properties.extra_data;
            delete batch_obj.properties.footprint;

            return batch_obj;
          });

          // Write stringified objects to stream while removing '[' and ']' from outer array.
          export_stream.write(JSON.stringify(batch).slice(1, -1));
        }
        export_stream.end(']}')
      }
    })
  }
}
