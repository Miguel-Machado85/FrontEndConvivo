import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Comentario } from 'src/app/models/comentario.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.scss'],
  imports: [CommonModule, MaterialModule]
})
export class AnunciosComponent {
  anuncios: Comentario[] = [];
  public authorMap: Record<string, Usuario> = {};

  constructor(
    private comentarioService: ComentarioService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const currentUserId = localStorage.getItem('id') || '';
    if (!currentUserId) {
      console.error('No user ID found in localStorage');
      return;
    }

    // Fetch current user's data to get their conjuntoId
    this.usuarioService.getUsuario(currentUserId).subscribe({
      next: (usuario: Usuario) => {
        // Extract conjuntoId - it could be a string or an object with _id property
        const conjuntoId = typeof usuario.conjuntoId === 'string' 
          ? usuario.conjuntoId 
          : usuario.conjuntoId?._id;

        if (conjuntoId) {
          // Fetch all announcements from this conjunto for vecinos to see
          this.comentarioService.getAnunciosByConjuntoId(conjuntoId).subscribe({
            next: (anuncios: Comentario[]) => {
              this.anuncios = anuncios.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
              });

              const uniqueIds = Array.from(new Set(this.anuncios.map(a => a.usuarioId).filter(Boolean)));
              uniqueIds.forEach(id => this.getAuthorById(id));
            },
            error: (error) => {
              console.error('Error fetching announcements:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  getAuthorById(id: string): void {
    if (!id) return;
    if (this.authorMap[id]) return; // cached

    this.usuarioService.getUsuario(id).subscribe({
      next: (res) => {
        this.authorMap[id] = res;
      },
      error: (error) => {
        console.error('Error consiguiendo datos de usuario:', id, error);
      }
    });
  }
}
