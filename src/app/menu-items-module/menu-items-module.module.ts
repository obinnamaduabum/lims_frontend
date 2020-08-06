import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuListItemComponent} from './menu-list-item/menu-list-item.component';
import {RouterModule} from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [MenuListItemComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatListModule
  ],
  exports: [MenuListItemComponent]
})
export class MenuItemsModule { }
