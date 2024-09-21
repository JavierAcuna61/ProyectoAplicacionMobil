import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarios: any[] = [];

  constructor(public alertController: AlertController) {}

  agregarUsuario(usuario: any): void {
    this.usuarios.push(usuario);
  }

  obtenerUsuarios(): any[] {
    return this.usuarios;
  }

  obtenerUsuarioPorCorreo(correo: string): any | undefined {
    return this.usuarios.find(user => user.correo_electronico === correo);
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
