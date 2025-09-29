import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-vecino',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './menuVecino.component.html',
})

export class MenuVecinoComponent {
    
}