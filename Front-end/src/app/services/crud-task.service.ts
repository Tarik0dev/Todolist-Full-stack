import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddTaskRequestInterface } from '../models/request/crudTaskRequest.interface';
import { AddTaskResponseInterface, Task } from '../models/response/crudTaskResponse.interface';
import { GetAllTaskResponseInterface } from '../models/response/crudTaskResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class CrudTaskService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  addTask(task: AddTaskRequestInterface): Observable<AddTaskResponseInterface> {
    return this.http.post<AddTaskResponseInterface>(this.apiUrl + '/task/add', task);
  }

  getTask(description?: string): Observable<GetAllTaskResponseInterface> {
    let options: { [key: string]: string } = {};
    if (description) {
      options['description'] = description;
    }
    return this.http.get<GetAllTaskResponseInterface>(this.apiUrl + '/task/getAll', {
      params: options,
    });
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/task/delete/${taskId.toString()}`);
  }

  updateTask(taskId: number, description: string): Observable<HttpResponse<void>> {
    return this.http.put<void>(
      `${this.apiUrl}/task/update/${taskId}`,
      { description },
      { observe: 'response' },
    );
  }

  completedTask(taskId: number, data: { is_done: boolean }): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/task/completed/${taskId.toString()}`, data);
  }
}
