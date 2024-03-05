// app.component.ts
import { Component, OnInit } from '@angular/core';
import { PetService } from './pet.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  petFolders: string[] = [];
  newPetName: string = '';

  constructor(private petService: PetService) {}

  ngOnInit() {
    this.listPetFolders();
  }

  listPetFolders() {
    this.petService.listPetFolders().subscribe(
      (response) => {
        this.petFolders = response.folders;
      },
      (error) => {
        console.error('Error fetching pet folders:', error);
      }
    );
  }

  createPetFolder() {
    if (this.newPetName.trim()) {
      this.petService.createPetFolder(this.newPetName.trim()).subscribe(
        () => {
          console.log('Pet folder created successfully');
          this.listPetFolders(); // Refresh the list of pet folders after creating a new one
        },
        (error) => {
          console.error('Error creating pet folder:', error);
        }
      );
    } else {
      console.warn('Please enter a valid pet name');
    }
  }

  deletePetFolder(petName: string) {
    if (confirm(`Are you sure you want to delete the pet folder "${petName}"?`)) {
      this.petService.deletePetFolder(petName).subscribe(
        () => {
          console.log('Pet folder deleted successfully');
          this.listPetFolders(); // Refresh the list of pet folders after deleting one
        },
        (error) => {
          console.error('Error deleting pet folder:', error);
        }
      );
    }
  }
}
