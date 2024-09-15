import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage {

  nombreUsuario: string = 'Javier Acuña';
  emailUsuario: string = 'ja.acunaq@duocuc.cl';
  telefonoUsuario: string = '+569 1234 5678';
  fechaNacimiento: string = '1990-01-01'; // Formato ISO para ion-datetime

  constructor() { }

  guardarCambios() {
    // Aquí puedes agregar la lógica para guardar los cambios, como hacer una solicitud HTTP al backend.
    console.log('Cambios guardados:', this.nombreUsuario, this.emailUsuario, this.telefonoUsuario, this.fechaNacimiento);
  }

}
