import { Component, OnInit } from '@angular/core';
import { TaxLotService } from '../core/services/tax-lot/tax-lot.service';

@Component({
  selector: 'app-taxlots-upload',
  templateUrl: './taxlots-upload.component.html',
  styleUrls: ['./taxlots-upload.component.scss']
})
export class TaxlotsUploadComponent implements OnInit {

  constructor(private taxlotService: TaxLotService) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    if (files[0]) {
      files[0].text().then(text => {
        const geojson = JSON.parse(text);
        const crs = geojson.crs ? geojson.crs : { type: 'name', properties: { name: 'EPSG:4326'} };

        geojson.features.forEach(feature => {
          const extra_data = feature.properties;
          feature.geometry.crs = crs;
          
          // extract non-extra_data attributes
          const ubid = extra_data.UBID;
          delete extra_data.UBID;
          
          this.taxlotService.model.create({
            extra_data: extra_data,
            footprint: feature.geometry,
            ulid: ubid
          }).catch((err) => { 
            console.error(err);
          });
        });
      })
    }
  }

}
