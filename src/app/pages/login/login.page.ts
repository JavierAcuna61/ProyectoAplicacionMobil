import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  titulo: string = "Página de Login";
  email: string = "";
  password: string = "";

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  async login() {
    // Eliminar espacios en blanco al principio y al final
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();
  
    // Verificar si los campos de email y contraseña están vacíos
    if (!trimmedEmail || !trimmedPassword) {
      await this.showAlert("Por favor, ingresa ambos campos: correo y contraseña.");
      return;
    }
  
    // Recuperar datos de usuarios desde localStorage
    const usersData = localStorage.getItem('usuarios');
    if (usersData) {
      const users = JSON.parse(usersData);
      console.log('Usuarios en localStorage:', users);
  
      // Buscar el usuario con las credenciales ingresadas
      const user = users.find((u: any) => u.correo_electronico === trimmedEmail && u.contraseña === trimmedPassword);
  
      if (user) {
        // Limpiar campos después de iniciar sesión correctamente
        this.email = '';
        this.password = '';
  
        // Navegar a la página del home si las credenciales son correctas
        this.router.navigate(['/home']);
      } else {
        await this.showAlert("Correo o contraseña inválidos.");
      }
    } else {
      await this.showAlert("No se ha registrado ningún usuario.");
    }
  }
  showAlert(arg0: string) {
    throw new Error('Method not implemented.');
  }
}