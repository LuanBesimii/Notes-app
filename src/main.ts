import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {RouterModule} from "@angular/router";
import {APP_ROUTE} from "./app/app.route";
import {HttpClientModule} from "@angular/common/http";
import { importProvidersFrom} from "@angular/core";
import {CommonModule} from "@angular/common";
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(APP_ROUTE, { onSameUrlNavigation: 'reload' }), HttpClientModule, CommonModule),
    provideAnimations(),
    provideAnimations()
  ]

})
