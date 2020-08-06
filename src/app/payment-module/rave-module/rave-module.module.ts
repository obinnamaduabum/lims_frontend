import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaveComponent } from './rave/rave.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [RaveComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ], exports: [
    RaveComponent
  ]
})
export class RaveModule { }
