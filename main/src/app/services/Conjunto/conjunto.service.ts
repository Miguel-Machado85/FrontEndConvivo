import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conjunto } from 'src/app/models/conjunto.model';


@Injectable({
    providedIn: 'root'
})
export class ConjuntoService {
    private api_url = 'http://localhost:3000/conjunto';

    constructor(private http: HttpClient){}

    createConjunto(conjunto: Conjunto): Observable<any> {
        const endpoint = `${this.api_url}/create`;
        return this.http.post(endpoint, conjunto);
    }

    getConjuntos(): Observable<Conjunto[]>{
        const endpoint = `${this.api_url}/get`;
        return this.http.get<Conjunto[]>(endpoint);
    }
}