import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Comentario } from 'src/app/models/comentario.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';

@Component({
  selector: 'app-crear-comentarios',
  templateUrl: './crear-comentarios.component.html',
  styleUrls: ['./crear-comentarios.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CrearComentariosComponent implements OnInit {
  comentarioForm!: FormGroup;
  usuarioLigado!: Usuario
  usuarios: Usuario[]
  conjuntoId!: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comentarioService: ComentarioService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.getVecinos()
    this.initializeForm();
  }

  initializeForm(): void {
    this.comentarioForm = this.fb.group({
      asunto: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required]],
      relacionado: ['', []]
    });
  }

  onClear(): void {
    this.comentarioForm.reset();
  }

  onVolver(): void {
    this.router.navigate(['/comentarios/ver-comentarios']);
  }

  getVecinos(){
    const usuarioId = localStorage.getItem('id')!;

    this.usuarioService.getUsuario(usuarioId).subscribe({
      next: (res) => {
        this.conjuntoId = res.conjuntoId._id;
        this.usuarioService.getVecinosByConjunto(this.conjuntoId).subscribe({
          next: (res) => {
            this.usuarios = res
            console.log(res)
          }
        })
      },
      error: (err) => console.log(err),
    });
  }

  seleccionarLigado(usuarioId: string): void {
    this.usuarioService.getUsuario(usuarioId).subscribe({
      next: (res) => {
        this.usuarioLigado = res;

        console.log('Usuario seleccionado:', res);
      },
      error: (err) => console.log(err),
    });
  }

  onSubmit(): void {
    if (this.comentarioForm.valid) {
      const usuarioId = localStorage.getItem('id')!;
      const { descripcion, asunto } = this.comentarioForm.value;

      const comentarioData: Comentario = {
        descripcion: descripcion,
        asunto: asunto,
        tipo: "Comentario",
        usuarioId: usuarioId,
        usuarioLigado: this.usuarioLigado?._id || null
      };

      this.comentarioService.addComentario(comentarioData).subscribe({
        next: (res) => {
          alert('Comentario creado con exito');
        },
        error: (err) => {
          console.error(err);
          alert('Ocurrió un error al crear el comentario.');
        },
      });

      this.router.navigate(['/comentarios/ver-comentarios']);
    }
  }
}
