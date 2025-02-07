import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { home } from './app.home';
import { reports } from './app.report';
import { main } from './app.main';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {path: "", component: home },
  {path: "report", component: reports},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
