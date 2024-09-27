import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  email: string = "";

  constructor(private alertController: AlertController, private router: Router) { }

  async presentAlert() {
    if (this.email.trim() === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Correo de Verificación',
      message: `Se enviará un código de verificación al: ${this.email}`,  
      buttons: ['OK']
    });

    await alert.present();
    // Redirigir al home después de que la alerta sea cerrada
    await alert.onDidDismiss();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
