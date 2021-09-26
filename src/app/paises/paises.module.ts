import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PaisesRoutingModule } from './paises-routin.module';

import { SelectorPageComponent } from './pages/selector/selector-page.component';


@NgModule({
  declarations: [
    SelectorPageComponent
  ],
  exports: [
    SelectorPageComponent
  ] ,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    PaisesRoutingModule
  ]
})
export class PaisesModule { }
