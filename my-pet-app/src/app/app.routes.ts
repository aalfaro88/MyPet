// app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { PetComponent } from './pet/pet.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route for home page
  { path: 'pet/:petName', component: PetComponent } // Route for individual pet
];
