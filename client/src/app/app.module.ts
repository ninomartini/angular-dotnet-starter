import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    CoreModule,
    AppRoutingModule
  ],
  providers: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
