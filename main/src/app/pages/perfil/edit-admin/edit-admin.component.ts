import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Conjunto } from 'src/app/models/conjunto.model';
import { ConjuntoService } from 'src/app/services/Conjunto/conjunto.service';

@Component({
  selector: 'app-edit-admin',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.scss'
})
export class EditAdminComponent implements OnInit {
  adminForm!: FormGroup;
  adminId!: string;
  isLoading: boolean = false;
  listaConjuntos: Conjunto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private conjuntoService: ConjuntoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getConjuntos();
    this.initForm();
    this.adminId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    if (this.adminId) {
      this.getAdminById(this.adminId);
    }
  }

  getConjuntos(){
    this.conjuntoService.getConjuntos().subscribe({
      next: (res) =>{
        this.listaConjuntos = res;
      },
      error: (err) =>{
        console.error(err);
      }
    })
  }

  initForm(): void {
    this.adminForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]]
    });
  }

  getAdminById(id: string): void {
    this.isLoading = true;
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) => {
        this.adminForm.patchValue({
          nombreCompleto: res.usuario.nombreCompleto || '',
          correo: res.usuario.correo || '',
          telefono: res.detalle.telefono || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error consiguiendo datos de vecino:', error);
        this.isLoading = false;
      }
    });
  }

  onSave(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const data = {
      nombreCompleto: this.adminForm.value.nombreCompleto,
      correo: this.adminForm.value.correo,
      telefono: this.adminForm.value.telefono
    }

    if(this.adminId){
      this.usuarioService.updateAdmin(this.adminId, data).subscribe({
        next: () =>{
          alert('Se ha actualizado su perfil');
          this.router.navigate(['/perfil/admin'])
        },
        error: (err)=>{
          console.error('Error actualizando el perfil: ', err);
          alert("No se pudo actualizar su perfil");
        }
      })
    }
  }

  onCancel(): void {
    this.router.navigate(['/perfil/admin']);
  }

  get f(): any {
    return this.adminForm.controls;
  }
}
