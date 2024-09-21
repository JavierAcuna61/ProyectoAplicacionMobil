import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  usuarios: any[] = [];
  usuarioEdicion: any = null; 
  isEditing: boolean = false; 

  constructor(
    private usuarioService: UsuarioService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    console.log("Cargando la página de Administrar");
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarios = this.usuarioService.obtenerUsuarios();
  }

  async eliminarUsuario(index: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar Usuario',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.usuarios.splice(index, 1);
            this.cargarUsuarios();
          },
        },
      ],
    });

    await alert.present();
  }

  async abrirFormulario(usuario?: any) {
    this.usuarioEdicion = usuario ? { ...usuario } : {
      rut: '',
      nombre: '',
      apellido: '',
      correo_electronico: '',
      telefono: '',
    };
    this.isEditing = true;
  }

  async guardarUsuario() {
    if (this.isEditing) {
      // Actualizar usuario
      const index = this.usuarios.findIndex(u => u.correo_electronico === this.usuarioEdicion.correo_electronico);
      if (index > -1) {
        this.usuarios[index] = this.usuarioEdicion;
      }
    } else {
      // Agregar nuevo usuario
      this.usuarioService.agregarUsuario(this.usuarioEdicion);
      this.usuarios.push(this.usuarioEdicion);
    }

    this.usuarioEdicion = null; // Limpiar formulario
    this.isEditing = false;
    this.cargarUsuarios();
  }
}
