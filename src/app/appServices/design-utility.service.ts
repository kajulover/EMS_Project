import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Employee } from '../appModels/employee.model';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DesignUtilityService {
  api = config.URL_API;
  userId: any;

  constructor(private _http: HttpClient, private _authService: AuthService) {}

  ngOnInit() {}

  
  //  fetchData(){
    //   return this._http.get<Employee>(`${this.api}/empData2.json`)
    //   .pipe(map(resData=>{
      //     const userArray = []
  //     for(const key in resData){
  //       if(resData.hasOwnProperty(key)){
  //         userArray.push({userId:key, ...resData[key]})
  //       }
  //     }
  //     return userArray;
  //   }))
  //  }
  
  fetchData() {
    return this._http.get<Employee>(`${this.api}/empData2.json`).pipe(
      map((resData) => {
        console.log(resData);
        const userArray = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            userArray.push({ userId: key, ...resData[key] });
          }
        }
        return userArray;
      })
      );
    }
    
    fetchSingleEmployee(id) {
    return this._http.get<Employee>(`${this.api}/empData2/${id}.json`);
  }
  
  deleteEmployee(userId) {
    return this._http.delete(`${this.api}/empData2/${userId}.json`);
  }


  saveData(data) {
    return this._http.post<Employee>(`${this.api}/empData2.json`, data);
  }

}
