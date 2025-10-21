import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Admin } from 'src/app/models/admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfilAdmin.component.html',
  styleUrls: ['./style.scss']
})
export class PerfilAdminComponent {
  user: Usuario;
  admin: Admin;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.getDatosAdmin();
  }

  getDatosAdmin(){
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) =>{
        this.user = res.usuario;
        this.admin = res.detalle;

        console.log(res.usuario);
        console.log(res.detalle);
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }
}
