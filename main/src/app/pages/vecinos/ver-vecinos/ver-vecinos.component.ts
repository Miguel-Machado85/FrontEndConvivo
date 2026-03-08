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
    // datos de ejemplo temporales
    // const tempVecinos: Vecino[] = [
    //   {
    //     id: 1,
    //     nombre: 'Carlos Mendoza',
    //     apartamento: 'Apto 101',
    //     correo: 'carlos.mendoza@email.com',
    //     telefono: '+57 300 123 4567',
    //   },
    //   {
    //     id: 2,
    //     nombre: 'María González',
    //     apartamento: 'Apto 205',
    //     correo: 'maria.gonzalez@email.com',
    //     telefono: '+57 310 234 5678',
    //   },
    //   {
    //     id: 3,
    //     nombre: 'Juan Pérez',
    //     apartamento: 'Apto 308',
    //     correo: 'juan.perez@email.com',
    //     telefono: '+57 320 345 6789',
    //   },
    //   {
    //     id: 4,
    //     nombre: 'Ana Rodríguez',
    //     apartamento: 'Apto 412',
    //     correo: 'ana.rodriguez@email.com',
    //     telefono: '+57 315 456 7890',
    //   },
    //   {
    //     id: 5,
    //     nombre: 'Luis Martínez',
    //     apartamento: 'Apto 515',
    //     correo: 'luis.martinez@email.com',
    //     telefono: '+57 305 567 8901',
    //   },
    //   {
    //     id: 6,
    //     nombre: 'Patricia López',
    //     apartamento: 'Apto 602',
    //     correo: 'patricia.lopez@email.com',
    //     telefono: '+57 318 678 9012',
    //   },
    // ];
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