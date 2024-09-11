import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  Usuario: FormGroup;

  constructor(private router: Router, private alertController: AlertController) {
    this.Usuario = new FormGroup({
      rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      correo_electronico: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarContraseña: new FormControl('', [Validators.required])
    }, { validators: this.matchingPasswords('contraseña', 'confirmarContraseña') });
  }

  ngOnInit() {
  }

  async registro(): Promise<void> {
    if (this.Usuario.valid) {
      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: '¡Te has registrado exitosamente!',
        buttons: ['OK']
      });

      await alert.present();
      await alert.onDidDismiss();

      this.router.navigate(['/home']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa el formulario correctamente.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }


  matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordKey)?.value;
      const confirmPassword = formGroup.get(confirmPasswordKey)?.value;
      return password === confirmPassword ? null : { notMatching: true };
    };
  }
}