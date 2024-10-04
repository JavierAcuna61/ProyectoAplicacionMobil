import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'administrador',
        loadChildren: () => import('../administrador/administrador.module').then( m => m.AdministradorPageModule)
      },
      {
        path: 'viaje',
        loadChildren: () => import('../viaje/viaje.module').then(m => m.ViajePageModule)
      },
      {
        path: 'usuario',
        loadChildren: () => import('../usuario/usuario.module').then(m => m.UsuarioPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
