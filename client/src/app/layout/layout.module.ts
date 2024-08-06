import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DefaultComponent } from './components/default/default.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        DefaultComponent
    ],
    exports: [
        FooterComponent
    ],
    imports: [
        SharedModule
    ]
})
export class LayoutModule {
}
