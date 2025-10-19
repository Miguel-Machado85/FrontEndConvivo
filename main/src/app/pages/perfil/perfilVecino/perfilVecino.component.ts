import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-perfil-vecino',
  templateUrl: './perfilVecino.component.html',
  styleUrls: ['./style.scss']
})
export class PerfilVecinoComponent implements OnInit {
  user: Usuario | null = null;
  loading = false;
  error: string | null = null;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    const id = this.resolveUserIdFromStorage();
    if (!id) {
      this.error = 'Usuario no identificado en localStorage';
      return;
    }

    this.loading = true;
    this.usuarioService.getUsuario(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (u: Usuario) => this.user = u,
        error: (err) => {
          console.error('Error obteniendo usuario:', err);
          this.error = 'Error cargando datos del usuario';
        }
      });
  }

  private resolveUserIdFromStorage(): string | null {
    const candidates = ['user', 'usuario'];
    for (const key of candidates) {
      const raw = localStorage.getItem(key);
      if (!raw) { continue; }
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.id) { return parsed.id; }
        if (parsed?._id) { return parsed._id; }
        // sometimes the object might be nested
        if (parsed?.usuario?.id) { return parsed.usuario.id; }
      } catch (e) {
        // not JSON — skip
      }
    }

    return localStorage.getItem('userId') || localStorage.getItem('id') || null;
  }
}
