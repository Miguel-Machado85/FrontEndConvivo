import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfilAdmin.component.html',
  styleUrls: ['./style.scss']
})
export class PerfilAdminComponent {
  user: Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.getDatosAdmin();
  }

  getDatosAdmin(){
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) =>{
        this.user = res;

        console.log(res);
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  goToEditAdmin(id: string): void {
    this.router.navigate(['/perfil/editAdmin', id])
  }
}