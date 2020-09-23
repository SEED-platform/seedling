import { Component, OnInit } from '@angular/core';
import { MapLoaderService } from 'app/core/services/map-loader/map-loader.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  public mapReady = false;

  constructor(private mapLoaderService: MapLoaderService) { 
    this.mapLoaderService.load().then(() => this.mapReady = true)
  }
  
  ngOnInit(): void {
  }

}
