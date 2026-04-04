import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Usuario } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-ver-vecinos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './ver-vecinos.component.html',
  styleUrls: ['./ver-vecinos.component.scss'],
})
export class VerVecinosComponent implements OnInit {
  usuarios: Usuario[]
  filteredUsuarios: Usuario[]
  searchTerm: string = '';
  conjuntoId: string;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.loadVecinos();
  }

  loadVecinos(): void {

    const id = localStorage.getItem('id') || ''
    this.usuarioService.getUsuario(id).subscribe({
      next: (res)=>{
        this.conjuntoId = res.conjuntoId._id;
        this.usuarioService.getVecinosByConjunto(this.conjuntoId).subscribe({
          next: (res)=>{
            this.usuarios = res
            this.filteredUsuarios = res
            console.log(res);
          },
          error: (err)=>{
            console.log(err);
          }
        })
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsuarios = this.usuarios
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(
      (usuario) =>
        usuario.nombreCompleto.toLowerCase().includes(term) ||
        usuario.correo.toLowerCase().includes(term)
    );
  }

  verDetalle(vecinoId: string): void {
    this.router.navigate([`/vecinos/detalle`, vecinoId]);
  }
}