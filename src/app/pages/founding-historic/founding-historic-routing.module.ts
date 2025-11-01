import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoundingHistoricComponent } from './founding-historic.component';

const routes: Routes = [
  {path: '', component: FoundingHistoricComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoundingHistoricRoutingModule { }
