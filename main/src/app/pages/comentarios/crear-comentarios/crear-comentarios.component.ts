import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-comentarios',
  templateUrl: './crear-comentarios.component.html',
  styleUrls: ['./crear-comentarios.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CrearComentariosComponent implements OnInit {
  comentarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.comentarioForm.valid) {
      const formData = this.comentarioForm.value;
      console.log('Comentario a enviar:', formData);
      // Aquí se llamará al servicio para enviar el comentario
      // this.comentarioService.createComentario(formData).subscribe(...);
      // Por ahora, navegamos de vuelta
      this.router.navigate(['/comentarios/ver-comentarios']);
    }
  }
}
