import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  usuarioService: any;
  
  Usuario = new FormGroup({
    rut: new FormControl('',[Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.pattern("[A-Za-z]{3,20}")]),
    apellido: new FormControl('',[Validators.required,Validators.pattern("[A-Za-z]{3,20}")]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
    correo_electronico : new FormControl('',Validators.required)
    
  });

  constructor() { }

  ngOnInit() {
  }

  registrar(){
    if(this.usuarioService.createUsuario(this.Usuario.value)){
      alert("Usuario creado con exito");
      this.Usuario.reset();
    }else{
      alert("Error en crear el Usuario");
    }
  }
  
  buscar(rut_buscar:string){
      this.Usuario.setValue(this.usuarioService.getUsuario(rut_buscar) );
  }

  modificar(rut_modificar:string){
    var rut_buscar : string =this.Usuario.controls.rut.value || "";
    if(this.usuarioService.updateUsuario(rut_buscar, this.Usuario.value)){
      alert("usuario modificado")
    }else{
      alert("error al modificar usuario")
    }
  }

 eliminar(rut_eliminar:string){
  if(this.usuarioService.deleteUsuario(rut_eliminar)){
      alert("usuario eliminado correctamente")
  }else{
    alert("Error al eliminar el usuario")
  }
 }


}
