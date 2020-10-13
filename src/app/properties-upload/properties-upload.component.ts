import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../core/services/property/property.service';


@Component({
  selector: 'app-properties-upload',
  templateUrl: './properties-upload.component.html',
  styleUrls: ['./properties-upload.component.scss']
})
export class PropertiesUploadComponent implements OnInit {
  constructor(private propertyService: PropertyService) {}

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
          
          this.propertyService.model.create({
            extra_data: extra_data,
            footprint: feature.geometry,
            ubid: ubid
          }).catch((err) => { 
            console.error(err);
          });
        });
      })
    }
  }

}
