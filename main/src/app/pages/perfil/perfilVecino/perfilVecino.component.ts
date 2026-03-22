import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-vecino',
  templateUrl: './perfilVecino.component.html',
  styleUrls: ['./style.scss']
})
export class PerfilVecinoComponent{
  user: Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.getDatosVecino();
  }

  getDatosVecino(){
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

  goToEditVecino(id: string){
    this.router.navigate(['/perfil/editVecino', id])
  }
}
