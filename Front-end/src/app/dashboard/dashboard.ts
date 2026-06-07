import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTaskRequestInterface } from '../models/request/crudTaskRequest.interface';
import { CrudTaskService } from '../services/crud-task.service';
import { AddTaskResponseInterface, Task } from '../models/response/crudTaskResponse.interface';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { DatePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmDialogImports, DatePipe, TitleCasePipe, SlicePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private api = inject(CrudTaskService);
  totalTasks = signal<number>(0);
  ongoingTasks = signal<number>(0);
  completedTasks = signal<number>(0);
  tasks = signal<Task[]>([]);
  ngOnInit(): void {
    this.getTasks();
    this.getUserInfo();
    this.searchInput.valueChanges.subscribe({
      next: (value: string | null) => {
        this.getTasks();
      },
    });
  }

  userFirstName = signal('');
  userLastName = signal('');
  userInitials = signal('');

  searchInput = new FormControl<string>('');

  today: number = Date.now();

  priorities: {label: string, value: string}[ ] = [
    { label: "Faible", value: "low"},
    { label: "Moyenne", value: "medium"},
    { label: "Urgente", value: "high"},
  ]

  createTaskForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.maxLength(100)]),
    priority : new FormControl('medium', [Validators.required, Validators.maxLength(100)])
  })
  updateTaskInput = new FormControl('', [Validators.required, Validators.maxLength(100)]);


  getUserInfo() {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      let userFirstName = decoded.firstName;
      let userLastName = decoded.lastName;
      this.userFirstName.set(userFirstName);
      this.userLastName.set(userLastName);
    }
  }
  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    toast.success('Vous vous êtes déconnecté');
  }



  getTasks() {
    let descriptionParams: string | undefined = undefined;
    if (this.searchInput.value && this.searchInput.value.length > 2) {
      descriptionParams = this.searchInput.value;
    }
    this.api.getTask(descriptionParams).subscribe({
      next: (response) => {
        this.tasks.set(response.result);
        this.totalTasks.set(response.total);
        this.ongoingTasks.set(response.ongoing);
        this.completedTasks.set(response.completed);
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }

  delete(taskId: number): void {
    this.api.deleteTask(taskId).subscribe({
      next: () => {
        this.getTasks();
      },
      error: () => {
        alert('Impossible de supprimer cette tâche pour le moment');
      },
    });
  }

  OnSubmitUpdatedTask(taskId: number) {
    if (this.updateTaskInput.valid) {
      const value = this.updateTaskInput.value || '';

      this.api.updateTask(taskId, value).subscribe({
        next: () => {
          this.updateTaskInput.setValue(null);
          this.getTasks();
        },
        error: (error) => {
          console.error('Erreur :', error);
        },
      });
    }
  }

  updateCheckbox(item: Task) {
    const newValue = !item.is_done;

    this.api.completedTask(item.id, { is_done: newValue }).subscribe({
      next: () => {
        console.log('Checkbox mise à jour');
        this.getTasks();
      },
      error: (error) => {
        console.error('Erreur :', error);
      },
    });
  }

  onSubmitNewTask() {
    console.log(this.createTaskForm.value)
    if (this.createTaskForm.valid) {
      const form = this.createTaskForm.value;

      const taskData: AddTaskRequestInterface = {
        description: form.name || '',
        priority: form.priority || 'medium'
      };

      this.api.addTask(taskData).subscribe({
        next: (response: AddTaskResponseInterface) => {
          console.log('succès :', response.message);
          this.createTaskForm.reset();
          this.getTasks();
        },
        error: (error) => {
          console.error('Erreur :', error);
        },
      });
    }
  }
}


