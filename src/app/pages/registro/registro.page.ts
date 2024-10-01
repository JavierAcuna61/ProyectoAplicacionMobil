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
  mostrarCampoPatente: boolean = false; // Controla la visibilidad del campo de patente

  constructor(private router: Router, private alertController: AlertController) {
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 18);
    this.fechaMaxima = fechaActual.toISOString().split('T')[0];

    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 65);
    this.fechaMinima = fechaMinima.toISOString().split('T')[0];

    // Inicialización del formulario
    this.Usuario = new FormGroup({
      rut: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{7,8}-[0-9Kk]{1}$"), this.validarRUT()]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]), 
      tiene_auto: new FormControl(false), // Campo "¿Tiene auto?"
      patente: new FormControl('', []), // Inicialmente sin validadores
      correo_electronico: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
      confirmarContraseña: new FormControl('', [Validators.required]),
      nombre_usuario: new FormControl('', [Validators.required]),
     
    }, { validators: this.matchingPasswords('contraseña', 'confirmarContraseña') });

    // Subscribirse a los cambios del campo "tiene_auto"
    this.Usuario.get('tiene_auto')?.valueChanges.subscribe(value => {
      this.mostrarCampoPatente = value; // Mostrar/ocultar campo de patente
      if (value) {
        this.Usuario.get('patente')?.setValidators([
          Validators.required,
          Validators.pattern("^[A-Z]{2}-[A-Z]{2}-[0-9]{2}$|^[A-Z]{2}-[0-9]{2}-[0-9]{2}$") // Validación para ambos formatos
        ]);
      } else {
        this.Usuario.get('patente')?.clearValidators();
      }
      this.Usuario.get('patente')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.Usuario.get('correo_electronico')?.valueChanges.subscribe(value => {
      this.generarNombreUsuario(value);
    });
  }
    
    

  // Método para manejar el toggle "¿Tiene auto?"
  onToggleAuto(event: any) {
    this.mostrarCampoPatente = event.detail.checked;
  }

  // Método para registrar
  async registro(): Promise<void> {
    if (this.Usuario.valid) {
      const existingUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');
      existingUsers.push(this.Usuario.value);
      localStorage.setItem('usuarios', JSON.stringify(existingUsers));
  
      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: '¡Te has registrado exitosamente!',
        buttons: ['OK']
      });
  
      await alert.present();
      await alert.onDidDismiss();
  
      this.router.navigate(['/login']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: this.getFormErrorMessage(),
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  getFormErrorMessage(): string {
    if (this.Usuario.get('nombre')?.hasError('required')) {
      return 'El nombre es requerido.';
    }
    if (this.Usuario.get('apellido')?.hasError('required')) {
      return 'El apellido es requerido.';
    }
    if (this.Usuario.get('correo_electronico')?.hasError('email')) {
      return 'Correo electrónico inválido.';
    }
    if (this.Usuario.get('contraseña')?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (this.Usuario.hasError('notMatching')) {
      return 'Las contraseñas no coinciden.';
    }
    if (this.Usuario.get('patente')?.hasError('pattern')) {
      return 'Formato de patente inválido. Ejemplo válido: AB-12-12 o AB-AB-21.';
    }
    return 'Por favor, completa el formulario correctamente.';
  }

  validarRUT(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rutValue = control.value;
      if (!rutValue) return null;

      const [rutBody, dvIngresado] = rutValue.split('-');
      if (!rutBody || !dvIngresado) return { invalidRUT: true };

      const dvCalculado = this.calcularDigitoVerificador(rutBody);
      return dvCalculado.toLowerCase() === dvIngresado.toLowerCase() ? null : { invalidRUT: true };
    };
  }

  calcularDigitoVerificador(rut: string): string {
    let suma = 0;
    let multiplicador = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
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

  generarNombreUsuario(email: string) {
    const username = email.split('@')[0];
    if (!this.Usuario.get('nombre_usuario')?.value) {
      this.Usuario.get('nombre_usuario')?.setValue(username);
    }
  }
}
