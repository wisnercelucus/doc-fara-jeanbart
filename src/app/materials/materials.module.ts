import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const materials = [
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule
]


@NgModule({
  imports: [
    CommonModule,
    materials
  ],
  exports:[
    materials
  ]

})
export class MaterialsModule { }
