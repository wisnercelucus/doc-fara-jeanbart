import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../materials/materials.module';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    MaterialsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
