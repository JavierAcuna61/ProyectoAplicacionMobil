import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  fechaMaxima: string = '';
  fechaMinima: string = '';
  Usuario: FormGroup;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService // Inyecta el servicio de usuarios
  ) {
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
      confirmarContraseña: new FormControl('', [Validators.required]),
      nombre_usuario: new FormControl('', [Validators.required])
    }, { validators: this.matchingPasswords('contraseña', 'confirmarContraseña') });
  }

  ngOnInit() {
    this.Usuario.get('correo_electronico')?.valueChanges.subscribe(value => {
      this.generarNombreUsuario(value);
    });
  }

  async registro(): Promise<void> {
    if (this.Usuario.valid) {
      const existingUser = this.usuarioService.obtenerUsuarioPorCorreo(this.Usuario.value.correo_electronico);
      if (existingUser) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Este correo electrónico ya está registrado.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
  
      this.usuarioService.agregarUsuario(this.Usuario.value);
      
      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: '¡Te has registrado exitosamente!',
        buttons: ['OK']
      });
  
      await alert.present();
      await alert.onDidDismiss();
      this.Usuario.reset(); // Limpiar el formulario
      this.router.navigate(['/home']);
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
    if (this.Usuario.get('nombre')?.hasError('pattern')) {
        return 'El nombre debe contener solo letras y tener entre 3 y 20 caracteres.';
    }
    if (this.Usuario.get('apellido')?.hasError('required')) {
        return 'El apellido es requerido.';
    }
    if (this.Usuario.get('apellido')?.hasError('pattern')) {
        return 'El apellido debe contener solo letras y tener entre 3 y 20 caracteres.';
    }
    if (this.Usuario.get('correo_electronico')?.hasError('required')) {
        return 'El correo electrónico es requerido.';
    }
    if (this.Usuario.get('correo_electronico')?.hasError('email')) {
        return 'Correo electrónico inválido.';
    }
    if (this.Usuario.get('contraseña')?.hasError('required')) {
        return 'La contraseña es requerida.';
    }
    if (this.Usuario.get('contraseña')?.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (this.Usuario.hasError('notMatching')) {
        return 'Las contraseñas no coinciden.';
    }
    if (this.Usuario.get('rut')?.hasError('required')) {
        return 'El RUT es requerido.';
    }
    if (this.Usuario.get('rut')?.hasError('pattern')) {
        return 'El RUT debe seguir el formato correcto (7-8 dígitos y un dígito verificador).';
    }
    if (this.Usuario.get('telefono')?.hasError('required')) {
        return 'El número telefónico es requerido.';
    }
    if (this.Usuario.get('telefono')?.hasError('pattern')) {
        return 'El número telefónico debe contener solo números.';
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
      const nombre = this.Usuario.get('nombre')?.value || '';
      const apellido = this.Usuario.get('apellido')?.value || '';
      const nombreUsuario = `${nombre.toLowerCase().charAt(0)}.${apellido.toLowerCase()}`;
      this.Usuario.get('nombre_usuario')?.setValue(nombreUsuario);
    }
  }
  


  
  
}
