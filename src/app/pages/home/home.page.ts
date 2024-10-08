import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nombre_usuario: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  

  async ngOnInit() {
    console.log('ngOnInit llamado'); // Para depuración
    const Usuarios = localStorage.getItem('usuario');
    if (Usuarios) {
      const userData = JSON.parse(Usuarios);
      this.nombre_usuario = userData.nombre_usuario;
      await this.presentWelcomeAlert();
    } else {
      console.log('No hay usuario en localStorage'); // Para depuración
    }
  }
  

  async presentWelcomeAlert() {
    const alert = await this.alertController.create({
      header: 'Bienvenido',
      message: `¡Hola, ${this.nombre_usuario}!`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirmarSalida() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Acción cuando se cancela
          }
        },
        {
          text: 'Salir',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  
  
  
}