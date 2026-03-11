import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTaskRequestInterface } from '../models/request/crudTaskRequest.interface';
import { CrudTaskService } from '../services/crud-task.service';
import { AddTaskResponseInterface, Task } from '../models/response/crudTaskResponse.interface';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { DatePipe } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmDialogImports, DatePipe],
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
    this.searchInput.valueChanges.subscribe({next: (value: string | null) => {
      this.getTasks();
    }});
  }
  
  userFirstName = signal('');
  userLastName = signal('');
  userInitials = signal('');

  searchInput = new FormControl<string>('');

  today: number = Date.now();
  getUserInfo() {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      // Affiche tout le contenu du token
      console.log('Token décodé :', decoded);
      const userFirstName = decoded.firstname;
      const userLastName = decoded.lastname;
      const firstInitial = decoded.firstName.charAt(0).toUpperCase();
      const lastInitial = decoded.lastName.charAt(0).toUpperCase();
      this.userFirstName.set(decoded.firstName);
      this.userLastName.set(decoded.lastName);
      this.userInitials.set(firstInitial + lastInitial);
    }
  }
  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    toast.success('Vous vous êtes déconnecté')
  }

  addTaskInput = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  updateTaskInput = new FormControl('', [Validators.required, Validators.maxLength(100)]);



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
    if (this.addTaskInput.valid) {
      const value = this.addTaskInput.value;
      const taskData: AddTaskRequestInterface = {
        description: value || '',
      };

      this.api.addTask(taskData).subscribe({
        next: (response: AddTaskResponseInterface) => {
          console.log('succès :', response.message);
          this.addTaskInput.setValue(null);
          this.getTasks();
        },
        error: (error) => {
          console.error('Erreur :', error);
        },
      });
    }
  }
}
