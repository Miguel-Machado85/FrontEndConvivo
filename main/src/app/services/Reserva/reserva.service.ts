import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';

@Injectable({
    providedIn: 'root'
})
export class ReservaService {
    private api_url = 'http://localhost:3000/reserva';

    constructor(private http: HttpClient){}

    createReserva(reserva: Reserva){
        const endpoint = `${this.api_url}/create`;
        return this.http.post(endpoint, reserva);
    }

    getReservas(): Observable<Reserva[]>{
        const endpoint = `${this.api_url}/get`
        return this.http.get<Reserva[]>(endpoint);
    }

    getReservaById(id: string): Observable<Reserva>{
        const endpoint = `${this.api_url}/get/${id}`;
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.get<Reserva>(endpoint, {headers});
    }
}