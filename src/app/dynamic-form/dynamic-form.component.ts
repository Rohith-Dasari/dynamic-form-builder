import { CommonModule } from '@angular/common';
import { Component, input, effect, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { dfStrings } from '../constants/df-constants';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  readonly constants = dfStrings;
  configInput = input<any[]>([], { alias: 'config' });
  config = signal<any[]>([]);
  form: FormGroup = new FormGroup({});
  private currentUserRole: string | null = null;

  constructor() {
    const currentUser = this.getCurrentUser();
    this.currentUserRole = currentUser?.role || null;

    effect(() => {
      const configValue = this.configInput();

      if (this.currentUserRole === 'admin') {
        this.config.set(configValue);
        this.buildForm(configValue);
      } else {
        const stored = localStorage.getItem('formConfig');
        const customerConfig = stored ? JSON.parse(stored) : [];
        this.config.set(customerConfig);
        this.buildForm(customerConfig);
      }
    });
  }

  private getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private buildForm(configData: any[]): void {
    const newFormGroup: any = {};

    if (configData && configData.length > 0) {
      configData.forEach((field) => {
        const validators = [];

        if (field.isRequired) {
          validators.push(Validators.required);
        }

        if (field.type === 'email') {
          validators.push(Validators.email);
        }

        const defaultValue = field.type === 'checkbox' ? false : '';
        newFormGroup[field.name] = new FormControl(defaultValue, validators);
      });
    }

    this.form = new FormGroup(newFormGroup);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    alert(
      'Form Submitted Successfully!\n\n' +
        JSON.stringify(this.form.value, null, 2)
    );
  }
}
