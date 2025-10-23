import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Conjunto } from 'src/app/models/conjunto.model';
import { ConjuntoService } from 'src/app/services/Conjunto/conjunto.service';

@Component({
  selector: 'app-edit-vecino',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-vecino.component.html',
  styleUrls: ['./edit-vecino.component.scss']
})
export class EditVecinoComponent implements OnInit {
  vecinoForm!: FormGroup;
  vecinoId!: string;
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

    this.vecinoId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    
    if (this.vecinoId) {
      this.getVecinoById(this.vecinoId);
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
    this.vecinoForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      numeroApartamento: ['', [Validators.required]],
      conjunto: ['', [Validators.required]]
    });
  }

  getVecinoById(id: string): void {
    this.isLoading = true;
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) => {
        this.vecinoForm.patchValue({
          nombreCompleto: res.usuario.nombreCompleto || '',
          correo: res.usuario.correo || '',
          telefono: res.detalle.telefono || '',
          numeroApartamento: res.detalle.numeroApartamento || '',
          conjuntoResidencial: res.detalle.conjunto.nombreConjunto || ''
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
    if (this.vecinoForm.invalid) {
      this.vecinoForm.markAllAsTouched();
      return;
    }

    const data = {
      nombreCompleto: this.vecinoForm.value.nombreCompleto,
      correo: this.vecinoForm.value.correo,
      conjuntoId: this.vecinoForm.value.conjunto,
      telefono: this.vecinoForm.value.telefono,
      numeroApartamento: this.vecinoForm.value.numeroApartamento
    }

    if(this.vecinoId){
      this.usuarioService.updateVecino(this.vecinoId, data).subscribe({
        next: (res)=>{
          alert('Se ha actualizado su perfil');
          this.router.navigate(['/perfil/vecino'])
        },
        error: (err)=>{
          console.error('Error actualizando el perfil: ', err);
          alert("No se pudo actualizar su perfil");
        }
      })
    }

  }

  onCancel(): void {
    this.router.navigate(['/perfil/vecino']);
  }
}
