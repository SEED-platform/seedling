import { Component, OnInit } from '@angular/core';
declare let Microsoft:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: any;

  constructor() { 
  }
  
  ngOnInit(): void {
    if (typeof Microsoft !== 'undefined') {
      this.loadMap()
    }
  }

  loadMap(): void {
    this.map = new Microsoft.Maps.Map('#inventory-map');
    const center = this.map.getCenter();
    const exteriorRing = [
      center,
      new Microsoft.Maps.Location(center.latitude - 0.5, center.longitude - 1),
      new Microsoft.Maps.Location(center.latitude - 0.5, center.longitude + 1),
      center
    ];
  
    //Create a polygon
    const polygon = new Microsoft.Maps.Polygon(exteriorRing, {
      fillColor: 'rgba(0, 255, 0, 0.5)',
      strokeColor: 'red',
      strokeThickness: 2
    });
    
    this.map.entities.push(polygon)
  }
}
