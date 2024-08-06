import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxValidateCoreModule } from "@ngx-validate/core";
import { ToastrModule } from "ngx-toastr";
import { ButtonBusyDirective } from "./directives/button-busy.directive";
import { DelayedInputDirective } from "./directives/delayed-input.directive";
import { FocusRemoverDirective } from "./directives/focus-remover.directive";
import { HasRoleDirective } from "./directives/has-role.directive";
import { MomentFormatPipe } from "./pipes/moment-format.pipe";
import { MomentTimeAgoPipe } from "./pipes/moment-time-ago.pipe";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { RouterModule } from "@angular/router";
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { SelectLookupComponent } from './components/select-lookup/select-lookup.component';
import { SelectLookupOnlyComponent } from './components/select-lookup-only/select-lookup-only.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { TextInputOnlyComponent } from './components/text-input-only/text-input-only.component';

@NgModule({
  declarations: [
    ModalConfirmComponent,
    CheckBoxComponent,
    SelectLookupComponent,
    SelectLookupOnlyComponent,
    TextAreaComponent,
    TextInputComponent,
    TextInputOnlyComponent,
    ButtonBusyDirective,
    DelayedInputDirective,
    FocusRemoverDirective,
    HasRoleDirective,
    MomentFormatPipe,
    MomentTimeAgoPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxValidateCoreModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    NgxSpinnerModule.forRoot({
      type: 'ball-scale-multiple'
    }),
    NgbModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxValidateCoreModule,
    ToastrModule,
    NgxSpinnerModule,
    NgbModule,
    NgxMaskDirective,
    NgxMaskPipe,

    ModalConfirmComponent,
    CheckBoxComponent,
    SelectLookupComponent,
    SelectLookupOnlyComponent,
    TextAreaComponent,
    TextInputComponent,
    TextInputOnlyComponent,
    ButtonBusyDirective,
    DelayedInputDirective,
    FocusRemoverDirective,
    HasRoleDirective,
    MomentFormatPipe,
    MomentTimeAgoPipe
  ],
  providers: [
    provideNgxMask()
  ]
})
export class SharedModule {
}
