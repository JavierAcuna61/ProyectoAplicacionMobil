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
    if (this.email.trim() === '' || !this.isValidEmail(this.email)) {
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
    await alert.onDidDismiss();
    this.router.navigate(['/home']);
  }
  
  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  

  ngOnInit() {
  }

}
