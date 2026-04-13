import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { Comentario, ComentarioAdjunto } from 'src/app/models/comentario.model';

interface InfoField {
  label: string;
  value: any;
  icon: string;
  bgColor: string;
}

@Component({
  selector: 'app-detalle-vecino',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './detalle-vecino.component.html',
  styleUrls: ['./detalle-vecino.component.scss'],
})
export class DetalleVecinoComponent implements OnInit {
  usuario: Usuario | null = null
  reservas: Reserva[]
  reservasP: Reserva[]
  comentarios: Comentario[]
  comentariosSobreEl: Comentario[]
  vecinoId: string;
  isModalOpen = false;
  selectedAdjuntos: ComentarioAdjunto[] = [];
  currentAdjuntoIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private reservaService: ReservaService,
    private comentarioService: ComentarioService
  ) {}

  ngOnInit(): void {
    this.vecinoId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.vecinoId)

    this.getDatosVecino()
    this.getReservasFuturas()
    this.getReservasPasadas()
    this.getComentarios()
    this.getComentariosLigados()
  }

  getDatosVecino(){
    this.usuarioService.getUsuario(this.vecinoId).subscribe({
      next: (res) =>{
        this.usuario = res;

        console.log(res);

      }, 
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getReservasFuturas(){
    this.reservaService.getReservasByUsuarioId(this.vecinoId).subscribe({
      next: (res) =>{
        this.reservas = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getReservasPasadas(){
    this.reservaService.getReservasPasadas(this.vecinoId).subscribe({
      next: (res) =>{
        this.reservasP = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getComentarios(){
    this.comentarioService.getComentariosByUsuarioId(this.vecinoId).subscribe({
      next: (res) =>{
        this.comentarios = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getComentariosLigados(){
    this.comentarioService.getComentariosLigadosByUsuarioID(this.vecinoId).subscribe({
      next: (res) =>{
        this.comentariosSobreEl = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

  volverALista(): void {
    this.router.navigate(['/vecinos/ver-vecinos']);
  }

  openFileModal(adjuntos: ComentarioAdjunto[]): void {
    this.selectedAdjuntos = adjuntos;
    this.currentAdjuntoIndex = 0;
    this.isModalOpen = true;
  }

  closeFileModal(): void {
    this.isModalOpen = false;
    this.selectedAdjuntos = [];
    this.currentAdjuntoIndex = 0;
  }

  get currentAdjunto(): ComentarioAdjunto | null {
    if (this.selectedAdjuntos.length > 0) {
      return this.selectedAdjuntos[this.currentAdjuntoIndex];
    }
    return null;
  }

  selectAdjunto(index: number): void {
    if (index >= 0 && index < this.selectedAdjuntos.length) {
      this.currentAdjuntoIndex = index;
    }
  }

  getInfoFields(): InfoField[] {
    if (!this.usuario) return [];
    return [
      {
        label: 'Apartamento',
        value: this.usuario.numeroApartamento,
        icon: 'home',
        bgColor: 'info',
      },
      {
        label: 'Correo Electrónico',
        value: this.usuario?.correo,
        icon: 'email',
        bgColor: 'warning',
      },
      {
        label: 'Teléfono',
        value: this.usuario.telefono,
        icon: 'phone',
        bgColor: 'success',
      },
    ];
  }
}
