import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient,HttpParams } from "@angular/common/http"; 
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisFull } from '../intefaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl:string = environment.baseUrl;

  private _regiones: string[] = ['Africa','Americas','Asia','Europe','Oceania'];

  get regiones(): string[] {
    return  [...this._regiones ];
  }

  get httpParamsRegiones(){
    return new HttpParams().set('fields','alpha3Code,name');
  }  

  constructor( private httpClient: HttpClient) {}

  paisesPorRegion(region: string): Observable<Pais[]>{
    if(!region)
      return of([]);

    const url = `${this.baseUrl}/continent/${region}`;
    return this.httpClient.get<Pais[]>(url, {params: this.httpParamsRegiones});
  }
  
  fronteras(code: string): Observable<PaisFull | null>{
  if(!code)
    return of(null);
    
    const url = `${this.baseUrl}/alpha/${code}`;
    return this.httpClient.get<PaisFull>(url);
  }

  getPaisPorCodigo(code: string ): Observable<Pais>{
    const url = `${this.baseUrl}/alpha/${code}?fields=name,alpha3Code`;
    return this.httpClient.get<Pais>(url);
  }

  getPaisesPorCodigo( borders: string[]): Observable<Pais[]> {

    if(!borders){
      return of([]);
    }

   const peticiones: Observable<Pais>[] = [];
    borders.forEach( codigo=>{
      const peticion = this.getPaisPorCodigo(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }

}
