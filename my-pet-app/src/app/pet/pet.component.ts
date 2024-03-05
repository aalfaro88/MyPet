import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})
export class PetComponent implements OnInit {
  petName: string = '';
  uploadedImages: string[] = [];

  constructor(
    private petService: PetService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.petName = params['petName']; 
      if (this.petName) {
        this.loadPetImages(this.petName);
      }
    });
  }

  loadPetImages(petName: string) {
    this.petService.listImagesForPet(petName).subscribe({
      next: (response) => {
        this.uploadedImages = response.images;
      },
      error: (error) => {
        console.error('Failed to load images for pet:', error);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.match('image.*')) {
          this.uploadImage(files[i]);
        }
      }
    }
  }

  uploadImage(file: File): void {
    if (!this.petName || !file) {
      console.error('Pet name and file are required.');
      return;
    }
  
    console.log('Uploading image for pet:', this.petName);
    console.log('File to upload:', file);
  
    this.petService.uploadImage(this.petName, file).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully:', response);
        this.loadPetImages(this.petName);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
      }
    });
  }
  
  deleteImage(index: number): void {
    const imageUrl = this.uploadedImages[index];
    const parts = imageUrl.split('/');
    const lastPart = parts.pop();
    
    if (lastPart) { 
      const filename = lastPart.split('?')[0]; 
  
      if (this.petName && filename) {
        this.petService.deleteImage(this.petName, filename).subscribe({
          next: (response) => {
            console.log('Image deleted successfully:', response);
            this.uploadedImages.splice(index, 1);
          },
          error: (error) => {
            console.error('Error deleting image:', error);
          }
        });
      }
    } else {
      console.error('Could not extract filename from URL:', imageUrl);
    }
  }
}
