import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import 'reflect-metadata';
import '../polyfills';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { MaterialModule } from './material-module';
import { SharedModule } from './shared/shared.module';
import { MapComponent } from './map/map.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PropertiesUploadComponent } from './properties-upload/properties-upload.component';
import { TaxlotsUploadComponent } from './taxlots-upload/taxlots-upload.component';
import { DataExportComponent } from './data-export/data-export.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LeftNavComponent,
    MapComponent,
    InventoryComponent,
    PropertiesUploadComponent,
    TaxlotsUploadComponent,
    DataExportComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    OverlayscrollbarsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
