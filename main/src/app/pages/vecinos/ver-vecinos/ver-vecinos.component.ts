import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

export interface Vecino {
  id: number;
  nombre: string;
  apartamento: string;
  correo: string;
  telefono: string;
}

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
  vecinos: Vecino[] = [];
  filteredVecinos: Vecino[] = [];
  searchTerm: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadVecinos();
  }

  loadVecinos(): void {
    // datos de ejemplo temporales
    const tempVecinos: Vecino[] = [
      {
        id: 1,
        nombre: 'Carlos Mendoza',
        apartamento: 'Apto 101',
        correo: 'carlos.mendoza@email.com',
        telefono: '+57 300 123 4567',
      },
      {
        id: 2,
        nombre: 'María González',
        apartamento: 'Apto 205',
        correo: 'maria.gonzalez@email.com',
        telefono: '+57 310 234 5678',
      },
      {
        id: 3,
        nombre: 'Juan Pérez',
        apartamento: 'Apto 308',
        correo: 'juan.perez@email.com',
        telefono: '+57 320 345 6789',
      },
      {
        id: 4,
        nombre: 'Ana Rodríguez',
        apartamento: 'Apto 412',
        correo: 'ana.rodriguez@email.com',
        telefono: '+57 315 456 7890',
      },
      {
        id: 5,
        nombre: 'Luis Martínez',
        apartamento: 'Apto 515',
        correo: 'luis.martinez@email.com',
        telefono: '+57 305 567 8901',
      },
      {
        id: 6,
        nombre: 'Patricia López',
        apartamento: 'Apto 602',
        correo: 'patricia.lopez@email.com',
        telefono: '+57 318 678 9012',
      },
    ];
    this.vecinos = tempVecinos;
    this.filteredVecinos = tempVecinos;
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredVecinos = this.vecinos;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredVecinos = this.vecinos.filter(
      (vecino) =>
        vecino.nombre.toLowerCase().includes(term) ||
        vecino.apartamento.toLowerCase().includes(term) ||
        vecino.correo.toLowerCase().includes(term)
    );
  }

  verDetalle(vecinoId: number): void {
    this.router.navigate([`/vecinos/detalle/${vecinoId}`]);
  }
}
