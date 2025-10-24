import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from 'src/app/models/espacio.model';

@Injectable({
    providedIn: 'root'
})
export class EspacioService {
    private api_url = 'http://localhost:3000/espacio';

    constructor(private http: HttpClient){}

    createEspacio(espacio: Espacio){
        const endpoint = `${this.api_url}/create`;
        return this.http.post(endpoint, espacio);
    }

    getEspacios(): Observable<Espacio[]>{
        const endpoint = `${this.api_url}/get`
        return this.http.get<Espacio[]>(endpoint);
    }

    getEspacioById(id: string): Observable<Espacio>{
        const endpoint = `${this.api_url}/getUno/${id}`;
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.get<Espacio>(endpoint, {headers});
    }

    getEspaciosByConjuntoId(conjuntoId: string): Observable<Espacio[]>{
        const endpoint = `${this.api_url}/get/${conjuntoId}`;
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.get<Espacio[]>(endpoint, {headers});
    }
}