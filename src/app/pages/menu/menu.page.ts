import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  nombreUsuario: string = '';

  constructor(private router: Router, private alertController: AlertController) { }

  async ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const userData = JSON.parse(usuario);
      this.nombreUsuario = userData.nombre_usuario;
      await this.presentWelcomeAlert();
    }
  }

  async presentWelcomeAlert() {
    const alert = await this.alertController.create({
      header: 'Bienvenido',
      message: `¡Hola, ${this.nombreUsuario}!`,
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
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }
}