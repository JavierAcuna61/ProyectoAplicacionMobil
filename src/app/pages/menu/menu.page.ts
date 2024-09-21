import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nombreUsuario: string = '';

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  async ngOnInit() {
    const usuario = this.usuarioService.obtenerUsuarios(); // Aquí puedes obtener el usuario, si lo tienes guardado
    if (usuario.length > 0) { // Asegúrate de verificar que hay usuarios
      this.nombreUsuario = usuario[0].nombre_usuario; // Ajusta según cómo estés manejando los usuarios
      await this.usuarioService.mostrarAlerta('Bienvenido', `¡Hola, ${this.nombreUsuario}!`);
    }
  }

  async confirmarSalida() {
    const alert = await this.usuarioService.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salir',
          handler: () => {
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }
}
