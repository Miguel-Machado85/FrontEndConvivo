import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Comentario } from 'src/app/models/comentario.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-anuncios-admin',
  templateUrl: './anuncios-admin.component.html',
  styleUrls: ['./anuncios-admin.component.scss'],
  imports: [CommonModule, MaterialModule]
})
export class AnunciosAdminComponent {
  anuncios: Comentario[] = [];
  public authorMap: Record<string, Usuario> = {};

  constructor(
    private comentarioService: ComentarioService,
    private usuarioService: UsuarioService,
    private router: Router
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
          // Fetch all announcements from this conjunto
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
        console.error('Error getting user data:', id, error);
      }
    });
  }

  irCrear(): void {
    this.router.navigate(['/anuncios/crear']);
  }

  deleteAnuncio(id: string | undefined): void {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      this.comentarioService.deleteComentario(id).subscribe({
        next: () => {
          this.anuncios = this.anuncios.filter(a => a._id !== id);
          alert('Anuncio eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error deleting announcement:', error);
          alert('Ocurrió un error al eliminar el anuncio.');
        }
      });
    }
  }
}
