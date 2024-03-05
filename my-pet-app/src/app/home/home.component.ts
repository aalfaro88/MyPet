// home.component.ts

import { Component, OnInit } from '@angular/core';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  petFolders: string[] = [];
  newPetName: string = '';
  errorMessage: string = '';

  constructor(private petService: PetService) {}

  ngOnInit() {
    this.listPetFolders();
  }

  // List pet folders
  listPetFolders() {
    this.petService.listPetFolders().subscribe(
      (response) => {
        this.petFolders = response.folders;
      },
      (error) => {
        console.error('Error fetching pet folders:', error);
        this.errorMessage = 'Failed to fetch pet folders. Please try again later.';
      }
    );
  }

  // Create a new pet folder
  createPetFolder() {
    if (this.newPetName.trim()) {
      this.petService.createPetFolder(this.newPetName.trim()).subscribe(
        () => {
          this.listPetFolders(); // Refresh the list of pet folders
          this.newPetName = ''; // Reset input after successful creation
        },
        (error) => {
          console.error('Error creating pet folder:', error);
          this.errorMessage = 'Failed to create pet folder. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid pet name.';
    }
  }

// Delete a pet folder
deletePetFolder(folderName: string) {
  if (confirm(`Are you sure you want to delete the pet folder "${folderName}"?`)) {
    this.petService.deletePetFolder(folderName).subscribe(
      () => {
        this.listPetFolders(); // Refresh the list of pet folders
      },
      (error) => {
        console.error('Error deleting pet folder:', error);
        this.errorMessage = 'Failed to delete pet folder. Please try again later.';
      }
    );
  }
}

}
