import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Comentario } from 'src/app/models/comentario.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-comentarios',
  templateUrl: './ver-comentarios.component.html',
  styleUrls: ['./ver-comentarios.component.scss'],
  imports: [CommonModule]
})
export class VerComentariosComponent {
  constructor(private router: Router, private usuarioService: UsuarioService, private comentarioService: ComentarioService) {}

  comentarios: Comentario[]

  ngOnInit(): void {
    this.getComentarios()
  }

  getComentarios(){
    const id = localStorage.getItem('id') || '';
    this.comentarioService.getComentariosByUsuarioId(id).subscribe({
      next: (res) => {
        this.comentarios = res
        console.log(res)
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  goToCrearComentario() {
    this.router.navigate(['/comentarios/crear-comentarios']);
  }
}
