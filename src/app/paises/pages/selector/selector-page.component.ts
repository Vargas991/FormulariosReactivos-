import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisFull } from '../../intefaces/paises.interface';
import { switchMap, tap , } from 'rxjs/operators';



@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['',Validators.required],
    code    : ['',Validators.required],
    frontera: ['',Validators.required]
  });

   regiones       : string [] = [];   
   paisesPorRegion: Pais[] = [];
   fronteras      : Pais[] = [];
  
  // UI
  cargando: boolean = false;
  sinFronteras: boolean=false;

  constructor( private fb: FormBuilder,
                private paisesService: PaisesService)  { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap((_)=>{
            this.miFormulario.get('code')?.reset("");
            this.cargando = true;
          } ),
          switchMap( region => this.paisesService.paisesPorRegion(region)),
          ).subscribe( paises => {
            this.paisesPorRegion = paises;
            this.cargando = false;
        }, error=> console.log(error) );

    
     this.miFormulario.get('code')?.valueChanges
        .pipe(
          tap( (_)=> {
            this.sinFronteras=false;
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset("");
            this.cargando = true; 
          } ),
          switchMap(code => this.paisesService.fronteras(code)),
          switchMap(pais => this.paisesService.getPaisesPorCodigo(pais?.borders!))
          )
          .subscribe(fronteras => {
              if(fronteras.length ===0 && this.miFormulario.get('code')?.value !== "")
                  this.sinFronteras=true;
                  
              this.fronteras = fronteras;
              this.cargando = false; 
          }, error => {console.log(error)});
  }

  guardar(){  
    console.log(this.miFormulario.value);
  }
}
