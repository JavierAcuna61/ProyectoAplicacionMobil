import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/modelo'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage {
  users: User[] = [];

  constructor(private userService: UserService) { }

  // Se llama cada vez que la página entra en vista
  ionViewWillEnter() {
    this.loadUsers();
  }

  // Carga la lista de usuarios desde el servicio
  loadUsers() {
    this.users = this.userService.getUsers();
  }

  // Agrega un nuevo administrador
  addAdmin() {
    const newAdmin: User = {
      id: 0,
      name: 'Admin ' + (this.users.length + 1),
      email: `admin${this.users.length + 1}@app.com`,
      role: 'admin'
    };
    this.userService.addUser(newAdmin);
    this.loadUsers();
  }

  // Edita un usuario existente
  editUser(user: User) {
    const updatedUser = { ...user, name: user.name + ' (Editado)' };
    this.userService.updateUser(updatedUser);
    this.loadUsers();
  }

  // Elimina un usuario por su id
  deleteUser(id: number) {
    this.userService.deleteUser(id);
    this.loadUsers();
  }
}
