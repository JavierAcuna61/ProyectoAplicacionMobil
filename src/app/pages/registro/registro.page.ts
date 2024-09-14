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

  fechaMaxima: string = '';
  fechaMinima: string = '';
  Usuario: FormGroup;

  constructor(private router: Router, private alertController: AlertController) {
    // Inicialización de fecha máxima para el campo de fecha de nacimiento
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 18); 
    this.fechaMaxima = fechaActual.toISOString().split('T')[0]; 

    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 65); 
    this.fechaMinima = fechaMinima.toISOString().split('T')[0]; 

    // Definición del formulario
    this.Usuario = new FormGroup({
      rut: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{7,8}-[0-9Kk]{1}$"), this.validarRUT()]),
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

  validarRUT(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rutValue = control.value;
      if (!rutValue) return null; // Si el campo está vacío, no se realiza ninguna validación adicional

      const [rutBody, dvIngresado] = rutValue.split('-');
      if (!rutBody || !dvIngresado) return { invalidRUT: true }; // Asegurarse que tenga la estructura "cuerpo-dígito"

      const dvCalculado = this.calcularDigitoVerificador(rutBody);
      return dvCalculado.toLowerCase() === dvIngresado.toLowerCase() ? null : { invalidRUT: true };
    };
  }

  calcularDigitoVerificador(rut: string): string {
    let suma = 0;
    let multiplicador = 2;

    // Recorrer el RUT desde la derecha a la izquierda
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; // Si el multiplicador llega a 7, se reinicia a 2
    }

    const resto = 11 - (suma % 11);
    if (resto === 11) return '0';
    if (resto === 10) return 'K';
    return resto.toString();
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordKey)?.value;
      const confirmPassword = formGroup.get(confirmPasswordKey)?.value;
      return password === confirmPassword ? null : { notMatching: true };
    };
  }
}