import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comentario, ComentarioAdjunto } from 'src/app/models/comentario.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ver-comentarios',
  templateUrl: './ver-comentarios.component.html',
  styleUrls: ['./ver-comentarios.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class VerComentariosComponent implements OnInit {
  constructor(private router: Router, private usuarioService: UsuarioService, private comentarioService: ComentarioService) {}

  comentarios: Comentario[]
  isModalOpen = false
  selectedAdjuntos: ComentarioAdjunto[] = []
  currentAdjuntoIndex = 0

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

  openFileModal(adjuntos: ComentarioAdjunto[]): void {
    this.selectedAdjuntos = adjuntos;
    this.currentAdjuntoIndex = 0;
    this.isModalOpen = true;
  }

  closeFileModal(): void {
    this.isModalOpen = false;
    this.selectedAdjuntos = [];
    this.currentAdjuntoIndex = 0;
  }

  get currentAdjunto(): ComentarioAdjunto | null {
    if (this.selectedAdjuntos.length > 0) {
      return this.selectedAdjuntos[this.currentAdjuntoIndex];
    }
    return null;
  }

  selectAdjunto(index: number): void {
    if (index >= 0 && index < this.selectedAdjuntos.length) {
      this.currentAdjuntoIndex = index;
    }
  }


}
