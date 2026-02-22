import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-comentarios',
  templateUrl: './ver-comentarios.component.html',
  styleUrls: ['./ver-comentarios.component.scss']
})
export class VerComentariosComponent {
  constructor(private router: Router) {}

  goToCrearComentario() {
    this.router.navigate(['/comentarios/crear-comentarios']);
  }
}
