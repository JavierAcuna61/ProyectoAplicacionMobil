import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  titulo: string ="pagina login";
  
  email:string="hola123@gmail.com";
  password:string="hola1234";

  constructor(private router: Router) {}

  ngOnInit() {
  }

  login() {
    if(this.email == "hola123@gmail.com" && this.password == "hola1234"){
      this.router.navigate(['/menu']);
  }else{
    alert("Correo o contraseña invalida");
  }
}
}
