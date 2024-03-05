// pet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface PetFoldersResponse {
  folders: string[];
}

interface PetImagesResponse {
  images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private baseUrl = 'https://lxp00xz5tg.execute-api.us-east-2.amazonaws.com/test';
  private imageApiUrl = 'https://kvap3qgsyc.execute-api.us-east-2.amazonaws.com/test-images'; 

  constructor(private http: HttpClient) { }

  createPetFolder(folderName: string): Observable<any> {
    if (!folderName.trim()) {
      return throwError('Folder name cannot be empty.');
    }
    return this.http.post(`${this.baseUrl}/pet-folder`, { folderName: folderName.trim() }).pipe(
      catchError(error => {
        console.error('Error creating pet folder:', error);
        return throwError('Failed to create pet folder. Please try again later.');
      })
    );
  }

  listPetFolders(): Observable<PetFoldersResponse> {
    return this.http.get<PetFoldersResponse>(`${this.baseUrl}/pet-folder`).pipe(
      catchError(error => {
        console.error('Error fetching pet folders:', error);
        return throwError('Failed to fetch pet folders. Please try again later.');
      })
    );
  }

  deletePetFolder(folderName: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/pet-folder`, { body: { folderName: folderName } }).pipe(
      catchError(error => {
        console.error('Error deleting pet folder:', error);
        return throwError('Failed to delete pet folder. Please try again later.');
      })
    );
  }
  
  uploadImage(petName: string, file: File): Observable<any> {
    if (!petName || !file) {
      console.error('Pet name and file are required.');
      return throwError('Pet name and file are required.');
    }
  
    return new Observable(observer => {
      const reader = new FileReader();
  
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          observer.error('File read did not result in a string.');
          return;
        }
  
        const base64String = reader.result
          .replace('data:', '')
          .replace(/^.+,/, '');
  
        const body = {
          file: {
            filename: file.name,
            file_content: base64String,
          }
        };
  
        this.http.post(`${this.imageApiUrl}/pet-images/${encodeURIComponent(petName)}`, JSON.stringify(body)).subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => {
            console.error('Error uploading image:', error);
            observer.error('Failed to upload image. Please try again later.');
          }
        );
      };
  
      reader.onerror = (error) => {
        console.error('Error converting file to base64:', error);
        observer.error('Error converting file to base64.');
      };
  
      reader.readAsDataURL(file);
    });
  }
  
  deleteImage(petName: string, filename: string): Observable<any> {
    const encodedPetName = encodeURIComponent(petName);
    const encodedFilename = encodeURIComponent(filename);
    return this.http.delete(`${this.imageApiUrl}/pet-images/${encodedPetName}/${encodedFilename}`).pipe(
      catchError(error => {
        console.error('Error deleting image:', error);
        return throwError(() => new Error('Failed to delete image. Please try again later.'));
      })
    );
  }
  

listImagesForPet(petName: string): Observable<PetImagesResponse> {
  const encodedPetName = encodeURIComponent(petName.trim());

  return this.http.get<PetImagesResponse>(`${this.imageApiUrl}/pet-images/${encodedPetName}`).pipe(
    catchError(error => {
      console.error('Error fetching images for pet:', error);
      return throwError('Failed to fetch images for the pet. Please try again later.');
    })
  );
}


}