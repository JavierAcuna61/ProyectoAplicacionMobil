import { Injectable } from '@angular/core';
import { User } from '../models/modelo';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  constructor() { }

  // Crear usuario
  addUser(user: User) {
    user.id = this.idCounter++;
    this.users.push(user);
  }


  getUsers(): User[] {
    return [...this.users];  
  }

  // Leer un solo usuario
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Actualizar usuario
  updateUser(updatedUser: User) {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  // Eliminar usuario
  deleteUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }
}
