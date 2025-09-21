import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-admin',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './menuAdmin.component.html'
})

export class MenuAdminComponent {

}