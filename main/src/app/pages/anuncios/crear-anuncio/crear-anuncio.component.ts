import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Comentario } from 'src/app/models/comentario.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';

@Component({
  selector: 'app-crear-anuncio',
  templateUrl: './crear-anuncio.component.html',
  styleUrls: ['./crear-anuncio.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CrearAnuncioComponent implements OnInit {
  anuncioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comentarioService: ComentarioService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.anuncioForm = this.fb.group({
      asunto: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(150)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onClear(): void {
    this.anuncioForm.reset();
  }

  onVolver(): void {
    this.router.navigate(['/anuncios/admin']);
  }

  onSubmit(): void {
    if (this.anuncioForm.valid) {
      const usuarioId = localStorage.getItem('id') || '';
      const { asunto, descripcion } = this.anuncioForm.value;

      const formData = new FormData();
      formData.append('asunto', asunto);
      formData.append('descripcion', descripcion);
      formData.append('tipo', 'Anuncio');
      formData.append('usuarioId', usuarioId);
      formData.append('usuarioLigado', '');

      this.comentarioService.addComentario(formData).subscribe({
        next: (res) => {
          alert('Anuncio publicado exitosamente');
          this.router.navigate(['/anuncios/admin']);
        },
        error: (err) => {
          console.error(err);
          alert('Ocurrió un error al publicar el anuncio.');
        }
      });
    }
  }
}
