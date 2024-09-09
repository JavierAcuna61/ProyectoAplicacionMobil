import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  
})
export class RegistroPage implements OnInit {

  Usuario = new FormGroup({
    rut: new FormControl('',[Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.pattern("[A-Za-z]{3,20}")]),
    apellido: new FormControl('',[Validators.required,Validators.pattern("[A-Za-z]{3,20}")]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
    correo_electronico : new FormControl('',Validators.required)
    
  });
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  public registro():void{
    console.log(this.Usuario.value); 
    this.router.navigate(['/home']);
  }
    setResult(ev:any) {
      console.log(`Dismissed with role: ${ev.detail.role}`);
    }


  

}

