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
    //       [
    //         [37.3934010356015, -121.923334302218],
    //         [37.3934235330101, -121.923440592918],
    //         [37.3936116923571, -121.92356698003],
    //         [37.3936484785362, -121.923552774477],
    //         [37.3937228774319, -121.923605798117],
    //         [37.3938076004871, -121.923579872131],
    //         [37.3940008153921, -121.923153874221],
    //         [37.3938542232925, -121.923049383115],
    //         [37.3938827849227, -121.922986409567],
    //         [37.3939136124804, -121.923008376084],
    //         [37.3939762383228, -121.922870312593],
    //         [37.3939451114231, -121.922848133714],
    //         [37.3941511922195, -121.92239383827],
    //         [37.3939011155036, -121.922215665856],
    //         [37.3938209298304, -121.922245707602],
    //         [37.3937638721803, -121.922375373489],
    //         [37.3937797601238, -121.922449212554],
    //         [37.3937559028462, -121.922502531763],
    //         [37.3937077969401, -121.922519208098],
    //         [37.3937221819622, -121.922587819478],
    //         [37.3936194815158, -121.922621631181],
    //         [37.3935595703745, -121.922751070381],
    //         [37.393622229074, -121.923031397361],
    //         [37.3935969593067, -121.923085688948],
    //         [37.3935488099458, -121.923103636973],
    //         [37.3935622830086, -121.923168133175],
    //         [37.3934598037207, -121.923206355467],
    //         [37.3934010356015, -121.923334302218] 
    //       ]
    //     ],
    //     crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    //   },
    //   ubid: "test value 1"
    // }).catch((err) => { 
    //   console.log(err);
    // });

    // this.propertyService.model.create({
    //   footprint: { 
    //     type: 'Polygon',
    //     coordinates: [
    //       [
    //         [37.3926488315955, -121.921927934903],
    //         [37.3928510756926, -121.922202101072],
    //         [37.3929390141673, -121.922207804986],
    //         [37.3930732599008, -121.922052861196],
    //         [37.3932415645234, -121.922063433252],
    //         [37.3934063263662, -121.922289105213],
    //         [37.3934899304215, -121.922292040793],
    //         [37.3935351546543, -121.922241228436],
    //         [37.3935393982922, -121.922131384559],
    //         [37.3936719859283, -121.921981777383],
    //         [37.3936771900996, -121.92187653165],
    //         [37.3934316557982, -121.921541083575],
    //         [37.3934544694596, -121.921514872328],
    //         [37.3933816769832, -121.921415404554],
    //         [37.3932531884299, -121.921408137792],
    //         [37.393074742974, -121.921613331145],
    //         [37.3929636086739, -121.921461494209],
    //         [37.3926515094643, -121.921820333864],
    //         [37.3926488315955, -121.921927934903],
    //       ]
    //     ],
    //     crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    //   },
    //   ubid: "test value 2"
    // }).catch((err) => { 
    //   console.log(err);
    // });
    
    // this.taxlotService.model.create({
    //   footprint: { 
    //     type: 'Polygon',
    //     coordinates: [
    //       [
    //         [37.39339999999999, -121.9221875000002],
    //         [37.39417500000001, -121.9221875000002],
    //         [37.39417500000001, -121.9236249999998],
    //         [37.39339999999999, -121.9236249999998],
    //         [37.39339999999999, -121.9221875000002] 
    //       ]
    //     ],
    //     crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    //   },
    //   ulid: "test value 3"
    // }).catch((err) => { 
    //   console.log(err);
    // });

    // this.taxlotService.model.create({
    //   footprint: { 
    //     type: 'Polygon',
    //     coordinates: [
    //       [
    //         [37.39262499999998, -121.9214062499999],
    //         [37.39370000000002, -121.9214062499999],
    //         [37.39370000000002, -121.9223125000001],
    //         [37.39262499999998, -121.9223125000001],
    //         [37.39262499999998, -121.9214062499999] 
    //       ]
    //     ],
    //     crs: { type: 'name', properties: { name: 'EPSG:4326'} },
    //   },
    //   ulid: "test value 4"
    // }).catch((err) => { 
    //   console.log(err);
    // });

    debugger;
  }
}
