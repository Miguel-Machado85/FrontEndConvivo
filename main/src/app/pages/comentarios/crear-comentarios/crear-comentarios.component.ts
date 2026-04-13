import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  comentarioForm!: FormGroup;
  usuarioLigado!: Usuario
  usuarios: Usuario[]
  conjuntoId!: string
  selectedFiles: File[] = []
  selectedFileNames = 'Ningún archivo seleccionado'

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
    this.selectedFiles = [];
    this.selectedFileNames = 'Ningún archivo seleccionado';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onVolver(): void {
    this.router.navigate(['/comentarios/ver-comentarios']);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }

    // Add new files to existing files, up to 5 total
    const newFiles = Array.from(input.files);
    const availableSlots = 5 - this.selectedFiles.length;
    
    if (availableSlots > 0) {
      this.selectedFiles.push(...newFiles.slice(0, availableSlots));
    }

    // Update the display text
    if (this.selectedFiles.length === 0) {
      this.selectedFileNames = 'Ningún archivo seleccionado';
    } else if (this.selectedFiles.length === 1) {
      this.selectedFileNames = this.selectedFiles[0].name;
    } else {
      this.selectedFileNames = `${this.selectedFiles.length} archivos seleccionados`;
    }
    
    // Clear the input so the same file can be selected again if removed
    input.value = '';
  }

  removeFiles(): void {
    this.selectedFiles = [];
    this.selectedFileNames = 'Ningún archivo seleccionado';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.selectedFileNames = 'Ningún archivo seleccionado';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    } else if (this.selectedFiles.length === 1) {
      this.selectedFileNames = this.selectedFiles[0].name;
    } else {
      this.selectedFileNames = `${this.selectedFiles.length} archivos seleccionados`;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private buildComentarioFormData(descripcion: string, asunto: string, usuarioId: string): FormData {
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('asunto', asunto);
    formData.append('tipo', 'Comentario');
    formData.append('usuarioId', usuarioId);

    if (this.usuarioLigado?._id) {
      formData.append('usuarioLigado', this.usuarioLigado._id);
    }

    this.selectedFiles.forEach((file) => {
      formData.append('adjuntos', file);
    });

    return formData;
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

      const formData = this.buildComentarioFormData(descripcion, asunto, usuarioId);

      this.comentarioService.addComentario(formData).subscribe({
        next: (res) => {
          alert('Comentario creado con exito');
          this.router.navigate(['/comentarios/ver-comentarios']);
        },
        error: (err) => {
          console.error(err);
          alert('Ocurrió un error al crear el comentario.');
        },
      });
    }
  }
}
