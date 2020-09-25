import { Component, OnInit } from '@angular/core';
declare let Microsoft:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map: any;

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

  constructor() { 
  }
  
  ngOnInit(): void {
    if (typeof Microsoft !== 'undefined') {
      this.loadMap()
    }
  }

  loadMap(): void {
    const center = new Microsoft.Maps.Location(37.394825, -121.92375)
    this.map = new Microsoft.Maps.Map('#inventory-map', { 
      center: center,
      zoom: 16
    });

    // TODO Use Microsoft.Maps.loadModule('Microsoft.Maps.WellKnownText', function () {
    // There's an issue with referencing `this` within the callback fct, maybe
    // Or maybe it was the SRID needing to be set?
    // Using Microsoft.Maps.Polygon lat long for now

    // // fakeA
    // const fakeAFootprintCoords = [
    //   new Microsoft.Maps.Location(37.4034001194804, -121.879928627902),
    //   new Microsoft.Maps.Location(37.4034424477678, -121.879961294008),
    //   new Microsoft.Maps.Location(37.4035728551413, -121.879695796486),
    //   new Microsoft.Maps.Location(37.4035305267804, -121.879663130473),
    //   new Microsoft.Maps.Location(37.4034001194804, -121.879928627902)
    // ];
    // const fakeABoundingboxCoords = [
    //   new Microsoft.Maps.Location(37.4034, -121.87965625),
    //   new Microsoft.Maps.Location(37.403575, -121.87965625),
    //   new Microsoft.Maps.Location(37.403575, -121.87996875),
    //   new Microsoft.Maps.Location(37.4034, -121.87996875),
    //   new Microsoft.Maps.Location(37.4034, -121.87965625),
    // ];

    // const fakeAFootprint = new Microsoft.Maps.Polygon(fakeAFootprintCoords);
    // const fakeABoundingbox = new Microsoft.Maps.Polygon(fakeABoundingboxCoords, this.styles.polygonOptions);

    // this.map.entities.push(fakeAFootprint);
    // this.map.entities.push(fakeABoundingbox);

    // fakeB
    const fakeBFootprintCoords = [
      new Microsoft.Maps.Location(37.3934010356015, -121.923334302218),
      new Microsoft.Maps.Location(37.3934235330101, -121.923440592918),
      new Microsoft.Maps.Location(37.3936116923571, -121.92356698003),
      new Microsoft.Maps.Location(37.3936484785362, -121.923552774477),
      new Microsoft.Maps.Location(37.3937228774319, -121.923605798117),
      new Microsoft.Maps.Location(37.3938076004871, -121.923579872131),
      new Microsoft.Maps.Location(37.3940008153921, -121.923153874221),
      new Microsoft.Maps.Location(37.3938542232925, -121.923049383115),
      new Microsoft.Maps.Location(37.3938827849227, -121.922986409567),
      new Microsoft.Maps.Location(37.3939136124804, -121.923008376084),
      new Microsoft.Maps.Location(37.3939762383228, -121.922870312593),
      new Microsoft.Maps.Location(37.3939451114231, -121.922848133714),
      new Microsoft.Maps.Location(37.3941511922195, -121.92239383827),
      new Microsoft.Maps.Location(37.3939011155036, -121.922215665856),
      new Microsoft.Maps.Location(37.3938209298304, -121.922245707602),
      new Microsoft.Maps.Location(37.3937638721803, -121.922375373489),
      new Microsoft.Maps.Location(37.3937797601238, -121.922449212554),
      new Microsoft.Maps.Location(37.3937559028462, -121.922502531763),
      new Microsoft.Maps.Location(37.3937077969401, -121.922519208098),
      new Microsoft.Maps.Location(37.3937221819622, -121.922587819478),
      new Microsoft.Maps.Location(37.3936194815158, -121.922621631181),
      new Microsoft.Maps.Location(37.3935595703745, -121.922751070381),
      new Microsoft.Maps.Location(37.393622229074, -121.923031397361),
      new Microsoft.Maps.Location(37.3935969593067, -121.923085688948),
      new Microsoft.Maps.Location(37.3935488099458, -121.923103636973),
      new Microsoft.Maps.Location(37.3935622830086, -121.923168133175),
      new Microsoft.Maps.Location(37.3934598037207, -121.923206355467),
      new Microsoft.Maps.Location(37.3934010356015, -121.923334302218),
    ];    
    const fakeBBoundingboxCoords = [
      new Microsoft.Maps.Location(37.39339999999999, -121.9221875000002),
      new Microsoft.Maps.Location(37.39417500000001, -121.9221875000002),
      new Microsoft.Maps.Location(37.39417500000001, -121.9236249999998),
      new Microsoft.Maps.Location(37.39339999999999, -121.9236249999998),
      new Microsoft.Maps.Location(37.39339999999999, -121.9221875000002),
    ];

    const fakeBFootprint = new Microsoft.Maps.Polygon(fakeBFootprintCoords);
    const fakeBBoundingbox = new Microsoft.Maps.Polygon(fakeBBoundingboxCoords, this.styles.polygonOptions);

    this.map.entities.push(fakeBFootprint);
    this.map.entities.push(fakeBBoundingbox);

    // fakeC
    const fakeCFootprintCoords = [
      new Microsoft.Maps.Location(37.3926488315955, -121.921927934903),
      new Microsoft.Maps.Location(37.3928510756926, -121.922202101072),
      new Microsoft.Maps.Location(37.3929390141673, -121.922207804986),
      new Microsoft.Maps.Location(37.3930732599008, -121.922052861196),
      new Microsoft.Maps.Location(37.3932415645234, -121.922063433252),
      new Microsoft.Maps.Location(37.3934063263662, -121.922289105213),
      new Microsoft.Maps.Location(37.3934899304215, -121.922292040793),
      new Microsoft.Maps.Location(37.3935351546543, -121.922241228436),
      new Microsoft.Maps.Location(37.3935393982922, -121.922131384559),
      new Microsoft.Maps.Location(37.3936719859283, -121.921981777383),
      new Microsoft.Maps.Location(37.3936771900996, -121.92187653165),
      new Microsoft.Maps.Location(37.3934316557982, -121.921541083575),
      new Microsoft.Maps.Location(37.3934544694596, -121.921514872328),
      new Microsoft.Maps.Location(37.3933816769832, -121.921415404554),
      new Microsoft.Maps.Location(37.3932531884299, -121.921408137792),
      new Microsoft.Maps.Location(37.393074742974, -121.921613331145),
      new Microsoft.Maps.Location(37.3929636086739, -121.921461494209),
      new Microsoft.Maps.Location(37.3926515094643, -121.921820333864),
      new Microsoft.Maps.Location(37.3926488315955, -121.921927934903),
    ];    
    const fakeCBoundingboxCoords = [
      new Microsoft.Maps.Location(37.39262499999998, -121.9214062499999),
      new Microsoft.Maps.Location(37.39370000000002, -121.9214062499999),
      new Microsoft.Maps.Location(37.39370000000002, -121.9223125000001),
      new Microsoft.Maps.Location(37.39262499999998, -121.9223125000001),
      new Microsoft.Maps.Location(37.39262499999998, -121.9214062499999),
    ];

    const fakeCFootprint = new Microsoft.Maps.Polygon(fakeCFootprintCoords);
    const fakeCBoundingbox = new Microsoft.Maps.Polygon(fakeCBoundingboxCoords, this.styles.polygonOptions);

    this.map.entities.push(fakeCFootprint);
    this.map.entities.push(fakeCBoundingbox);

    // fakeD
    const fakeDFootprintCoords = [
      new Microsoft.Maps.Location(37.3930337201675, -121.920700832853),
      new Microsoft.Maps.Location(37.3931106656741, -121.920614028391),
      new Microsoft.Maps.Location(37.3931107680965, -121.920614649293),
      new Microsoft.Maps.Location(37.3931596043683, -121.920601188964),
      new Microsoft.Maps.Location(37.3931359161841, -121.920465992774),
      new Microsoft.Maps.Location(37.3931309276444, -121.920467377481),
      new Microsoft.Maps.Location(37.3931219613461, -121.920416153417),
      new Microsoft.Maps.Location(37.3931502930692, -121.920408360259),
      new Microsoft.Maps.Location(37.3931701286979, -121.920532776838),
      new Microsoft.Maps.Location(37.3932690939212, -121.920507979201),
      new Microsoft.Maps.Location(37.3932482607977, -121.920377449949),
      new Microsoft.Maps.Location(37.3932339333906, -121.920381068439),
      new Microsoft.Maps.Location(37.3932207080632, -121.92029829603),
      new Microsoft.Maps.Location(37.3931900157661, -121.920305974304),
      new Microsoft.Maps.Location(37.3931055023845, -121.919881333625),
      new Microsoft.Maps.Location(37.3930345740679, -121.919825109204),
      new Microsoft.Maps.Location(37.3927966815415, -121.919892708885),
      new Microsoft.Maps.Location(37.392753863926, -121.919980782856),
      new Microsoft.Maps.Location(37.3927865827287, -121.920166412573),
      new Microsoft.Maps.Location(37.3927604174238, -121.920197278041),
      new Microsoft.Maps.Location(37.3927669116735, -121.920239367079),
      new Microsoft.Maps.Location(37.3926881665605, -121.920331921305),
      new Microsoft.Maps.Location(37.3926558637963, -121.920318396965),
      new Microsoft.Maps.Location(37.3926490636981, -121.920326495793),
      new Microsoft.Maps.Location(37.3926472185673, -121.920322364106),
      new Microsoft.Maps.Location(37.3923846163071, -121.920629338328),
      new Microsoft.Maps.Location(37.3923796389172, -121.920734105467),
      new Microsoft.Maps.Location(37.3926259724194, -121.921069526316),
      new Microsoft.Maps.Location(37.3927110206514, -121.921073314759),
      new Microsoft.Maps.Location(37.3928378282453, -121.920926937238),
      new Microsoft.Maps.Location(37.3928438805491, -121.920969258555),
      new Microsoft.Maps.Location(37.3928755547372, -121.920932681375),
      new Microsoft.Maps.Location(37.3928659617788, -121.920919587802),
      new Microsoft.Maps.Location(37.3928767700309, -121.920907125325),
      new Microsoft.Maps.Location(37.3928667724679, -121.920893509016),
      new Microsoft.Maps.Location(37.3930193463886, -121.920717429188),
      new Microsoft.Maps.Location(37.3930183134704, -121.920814079063),
      new Microsoft.Maps.Location(37.3930716603132, -121.920752472698),
      new Microsoft.Maps.Location(37.3930337201675, -121.920700832853),
    ];    

    const fakeDBoundingboxCoords = [
      new Microsoft.Maps.Location(37.39237499999998, -121.9198124999999),
      new Microsoft.Maps.Location(37.39327500000001, -121.9198124999999),
      new Microsoft.Maps.Location(37.39327500000001, -121.9210937500001),
      new Microsoft.Maps.Location(37.39237499999998, -121.9210937500001),
      new Microsoft.Maps.Location(37.39237499999998, -121.9198124999999),
    ];

    const fakeDFootprint = new Microsoft.Maps.Polygon(fakeDFootprintCoords);
    const fakeDBoundingbox = new Microsoft.Maps.Polygon(fakeDBoundingboxCoords, this.styles.polygonOptions);

    this.map.entities.push(fakeDFootprint);
    this.map.entities.push(fakeDBoundingbox);
    
    // fakeE
    const fakeEFootprintCoords = [
      new Microsoft.Maps.Location(37.3941991013383, -121.923749386498),
      new Microsoft.Maps.Location(37.3946540565171, -121.924072450837),
      new Microsoft.Maps.Location(37.394640959363, -121.924101430236),
      new Microsoft.Maps.Location(37.3949246456703, -121.924302870278),
      new Microsoft.Maps.Location(37.3949380260193, -121.924273208337),
      new Microsoft.Maps.Location(37.3951891961959, -121.924451548839),
      new Microsoft.Maps.Location(37.3954723313713, -121.92382513511),
      new Microsoft.Maps.Location(37.3949960515056, -121.923486960522),
      new Microsoft.Maps.Location(37.3950270999231, -121.923418250514),
      new Microsoft.Maps.Location(37.3950627209067, -121.923443544972),
      new Microsoft.Maps.Location(37.3950821966649, -121.923400434787),
      new Microsoft.Maps.Location(37.3950338853713, -121.92336615377),
      new Microsoft.Maps.Location(37.3950135348343, -121.923411174196),
      new Microsoft.Maps.Location(37.3945126894179, -121.92305556428),
      new Microsoft.Maps.Location(37.3944581013702, -121.923176361588),
      new Microsoft.Maps.Location(37.3944265923249, -121.923153968455),
      new Microsoft.Maps.Location(37.3944035599834, -121.92320492943),
      new Microsoft.Maps.Location(37.3944350690189, -121.923227322577),
      new Microsoft.Maps.Location(37.3941991013383, -121.923749386498),
    ];    
    const fakeEBoundingboxCoords = [
      new Microsoft.Maps.Location(37.39417499999998, -121.9230312500002),
      new Microsoft.Maps.Location(37.39547500000003, -121.9230312500002),
      new Microsoft.Maps.Location(37.39547500000003, -121.9244687499998),
      new Microsoft.Maps.Location(37.39417499999998, -121.9244687499998),
      new Microsoft.Maps.Location(37.39417499999998, -121.9230312500002),
    ];

    const fakeEFootprint = new Microsoft.Maps.Polygon(fakeEFootprintCoords);
    const fakeEBoundingbox = new Microsoft.Maps.Polygon(fakeEBoundingboxCoords, this.styles.polygonOptions);

    this.map.entities.push(fakeEFootprint);
    this.map.entities.push(fakeEBoundingbox);

  }
}
