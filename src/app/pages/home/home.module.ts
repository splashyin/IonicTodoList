import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AmplifyAngularModule, AmplifyService, AmplifyIonicModule } from 'aws-amplify-angular';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmplifyAngularModule,
    AmplifyIonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage],
  providers: [AmplifyService]
})
export class HomePageModule {}
