import { CommonModule } from '@angular/common';
import { Component, input, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  config = input<any[]>([]);  // Using input signal instead of @Input
  form: FormGroup = new FormGroup({});
  private currentUserRole: string | null = null;

  constructor() {
    // Get user role once
    const currentUser = this.getCurrentUser();
    this.currentUserRole = currentUser?.role || null;

    // Use effect to rebuild form whenever config changes
    effect(() => {
      const configValue = this.config();
      
      if (this.currentUserRole === 'admin') {
        // Admin: use config from parent (signal)
        this.buildForm(configValue);
      } else {
        // Customer: use localStorage on first load only
        const stored = localStorage.getItem('formConfig');
        const customerConfig = stored ? JSON.parse(stored) : [];
        this.buildForm(customerConfig);
      }
    });
  }

  private getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private buildForm(configData: any[]) {
    // Create a completely new FormGroup to avoid stale control references
    const newFormGroup: any = {};

    if (configData && configData.length > 0) {
      configData.forEach(field => {
        const validators = [];
        
        // Add required validator if field is required
        if (field.isRequired) {
          validators.push(Validators.required);
        }
        
        // Add email validator for email type fields
        if (field.type === 'email') {
          validators.push(Validators.email);
        }
        
        const defaultValue = field.type === 'checkbox' ? false : '';
        newFormGroup[field.name] = new FormControl(defaultValue, validators);
      });
    }

    this.form = new FormGroup(newFormGroup);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }
    
    alert('Form Submitted Successfully!\n\n' + JSON.stringify(this.form.value, null, 2));
  }
}