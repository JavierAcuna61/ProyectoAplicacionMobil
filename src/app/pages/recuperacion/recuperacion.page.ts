import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  constructor(private alertController: AlertController) { }

  email:string="";

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
      message: `Se enviará un código de verificación al: <strong>${this.email}</strong>`,  
      buttons: ['OK']
    });

    await alert.present();
  }


    
   
    ngOnInit() {
  }

}
