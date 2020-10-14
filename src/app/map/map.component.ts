import { Component, OnInit } from '@angular/core';
import { PropertyService } from "../core/services/property/property.service";
import { TaxLotService } from 'app/core/services/tax-lot/tax-lot.service';
declare let Microsoft:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: any;

  styles = {
    pushpinOptions: {
      color: "rgba(166, 63, 30, 0.8)",
    },
    polylineOptions: {
      strokeColor: "rgba(215, 118, 0, 1.0)",
      strokeThickness: 3,
    },
    polygonOptions: {
      fillColor: "rgba(215, 118, 0, 0.4)",
      strokeColor: "rgba(215, 118, 0, 1.0)",
      strokeThickness: 3,
    },
  };

  constructor(
    private propertyService: PropertyService,
    private taxlotService: TaxLotService,
  ) {}
  
  ngOnInit(): void {
    if (typeof Microsoft !== 'undefined') {
      this.loadMap()
    }
  }

  loadMap(): void {
    this.map = new Microsoft.Maps.Map('#inventory-map', {});
    // init property layer second to have z-index greater than the tax lot layer
    const taxlotLayer = new Microsoft.Maps.Layer();
    const propertyLayer = new Microsoft.Maps.Layer();

    Promise.all([
      this.propertyService.model.findAll(),
      this.taxlotService.model.findAll()
    ]).then(values => {
      // for properties and tax lots, build polygon footprints and info boxes.
      const allFootprints = [];

      values[0].forEach(property => {
        if (property.footprint) {
          const footprintCoords = property.footprint.coordinates[0].map(coords => {
            return new Microsoft.Maps.Location(...coords.reverse())
          })
          const polygon = new Microsoft.Maps.Polygon(footprintCoords);
          const infobox = new Microsoft.Maps.Infobox(footprintCoords[0], {
            title: 'Property Information',
            description: JSON.stringify(property.extra_data),
            visible: false
          });
          infobox.setMap(this.map);
          polygon.metadata = { infobox: infobox };
          
          const displayInfobox = (e) => {
            e.target.metadata.infobox.setOptions({
              location: e.location,
              visible: true  
            });
          }
          Microsoft.Maps.Events.addHandler(polygon, 'click', displayInfobox);
          
          propertyLayer.add(polygon);
          allFootprints.splice(0, 0, polygon);
        }
      });

      values[1].forEach(taxlot => {
        if (taxlot.footprint) {
          const footprintCoords = taxlot.footprint.coordinates[0].map(coords => {
            return new Microsoft.Maps.Location(...coords.reverse())
          })
          const polygon = new Microsoft.Maps.Polygon(footprintCoords, this.styles.polygonOptions);
          const infobox = new Microsoft.Maps.Infobox(footprintCoords[0], {
            title: 'Tax Lot Information',
            description: JSON.stringify(taxlot.extra_data),
            visible: false
          });
          infobox.setMap(this.map);
          polygon.metadata = { infobox: infobox };
          
          const displayInfobox = (e) => {
            e.target.metadata.infobox.setOptions({
              location: e.location,
              visible: true  
            });
          }
          Microsoft.Maps.Events.addHandler(polygon, 'click', displayInfobox);
          taxlotLayer.add(polygon);
          allFootprints.splice(0, 0, polygon);
        }       
      });

      this.map.layers.insert(propertyLayer);
      this.map.layers.insert(taxlotLayer);

      if (allFootprints.length) {
        // allFootprints used because can't find attribute of map or layers to get shapes
        this.map.setView({
          bounds: new Microsoft.Maps.LocationRect.fromShapes(allFootprints)
        });
      }
    })
  }
}
