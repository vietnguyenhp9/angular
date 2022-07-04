import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import * as querystring from 'querystring';
import { Class } from '../../models/class/class.model';
import { ClassCategory } from '../../models/class/class-category.model';
import { ClassSchedule } from '../../models/class/class-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private API_URL = environment.API_URL;
  constructor(
    private http: HttpClient
  ) { }

  public getListClassCalendar(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/global/list-class-calendar?` + options);
  };

  public getListClass(): Observable<Class[]> {
    return this.http.get<Class[]>(this.API_URL + `/global/class`);
  };

  public getListClassBookingByClassId(classId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/user/list-class-calendar-booking/${classId}`);
  };

  public deleteClassBooking(id: string): Observable<{}> {
    return this.http.delete<{}>(this.API_URL + `/global/class-calendar/${id}`);
  }

  public getScheduleClass(id: string): Observable<{}> {
    return this.http.get<{}>(this.API_URL + `/global/class-calendar/${id}`);
  }

  public editScheduleClass(id: string, body: ClassSchedule): Observable<{}> {
    return this.http.put<{}>(this.API_URL + `/global/class-calendar/${id}`, body);
  }

  public createScheduleClass(body: ClassSchedule): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/global/add-class-calendar/`, body);
  }

  public getStudioByClub(clubId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/general/studio/${clubId}`);
  }

  public getListClassCategory(): Observable<ClassCategory[]> {
    return this.http.get<ClassCategory[]>(this.API_URL + `/global/class-category`);
  }

  public getListClassByCategory(categoryId: string): Observable<Class[]> {
    return this.http.get<Class[]>(this.API_URL + `/global/list-classes/${categoryId}`);
  }

  public deleteClassCategory(body: any): Observable<{}> { // body: id
    const options = {
      header: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body
    };
    return this.http.delete<{}>(this.API_URL + `/global/class-category`, options);
  }

  public editClassCategory(idCategoryClass: string, body: ClassCategory): Observable<{}> {
    // body: descriptionEn, descriptionVi, nameEn, nameVi
    return this.http.put<{}>(this.API_URL + `/global/class-category/${idCategoryClass}`, body);
  }

  public deleteClass(body: any): Observable<{}> {
    const options = {
      header: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body
    };
    return this.http.delete<{}>(this.API_URL + `/global/class`, options);
  }

  public editClass(idClass: string, body: Class): Observable<{}> {
    return this.http.put<{}>(this.API_URL + `/global/class/${idClass}`, body);
  }

  public addClassCategory(body: ClassCategory): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/global/class-category`, body);
  }

  public addClass(body: Class): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/global/class`, body);
  }

  public getListClassBooking(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/list-class-booking?` + options);
  }
}
