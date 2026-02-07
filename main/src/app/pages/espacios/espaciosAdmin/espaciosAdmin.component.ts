import { Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Espacio } from 'src/app/models/espacio.model';

@Component({
  selector: 'app-espacios-admin',
    imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './espaciosAdmin.component.html',
  styleUrls: ['./style.scss']
})
export class EspaciosAdminComponent {

  constructor(private espacioService: EspacioService, private usuarioService: UsuarioService, private router: Router) { }

  conjuntoId: string;
  espacios: Espacio[];

  ngOnInit(): void {
    this.getEspaciosConjunto();
  }

  getEspaciosConjunto(){
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res)=>{
        this.conjuntoId = res.detalle.conjuntoId;
        this.espacioService.getEspaciosByConjuntoId(this.conjuntoId).subscribe({
          next: (res)=>{
            this.espacios = res;
            console.log(res);
          },
          error: (err)=>{
            console.log(err);
          }
        })
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  irCrear(){
    this.router.navigate(['/espacios/crear'])
  }
  
    irEditar(id: string) {
      this.router.navigate([`/espacios/editar/${id}`]);
    }
}