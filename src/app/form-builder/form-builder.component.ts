import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { fbStrings } from '../constants/fb-constants';

@Component({
  selector: 'app-form-builder',
  imports: [FormsModule, CommonModule, DynamicFormComponent],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss',
})
export class FormBuilderComponent {
  readonly constants = fbStrings;
  formFields = signal<any[]>([]);
  newField: any = {
    type: 'text',
    label: '',
    name: '',
    options: [],
    isRequired: false,
  };

  labelError = '';
  nameError = '';
  optionsError = '';

  onAddOption(option: string): void {
    if (option.trim()) {
      this.newField.options.push(option);
      this.optionsError = '';
    }
  }

  addField(): void {
    this.labelError = '';
    this.nameError = '';
    this.optionsError = '';

    let hasError = false;

    if (!this.newField.label?.trim()) {
      this.labelError = 'Label is required';
      hasError = true;
    }

    if (!this.newField.name?.trim()) {
      this.nameError = 'Name is required';
      hasError = true;
    } else {
      const nameExists = this.formFields().some(
        (field) => field.name === this.newField.name.trim()
      );
      if (nameExists) {
        this.nameError = 'Name must be unique';
        hasError = true;
      }
    }

    if (
      this.newField.type === 'dropdown' &&
      this.newField.options.length === 0
    ) {
      this.optionsError = 'Add at least one option';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    this.formFields.update((fields) => [...fields, { ...this.newField }]);
    this.newField = {
      type: 'text',
      label: '',
      name: '',
      options: [],
      isRequired: false,
    };
  }

  saveForm(): void {
    localStorage.setItem('formConfig', JSON.stringify(this.formFields()));
    alert('Form saved successfully!');
  }

  deleteField(index: number): void {
    const field = this.formFields()[index];
    if (confirm(`Delete field "${field.label || field.name}"?`)) {
      this.formFields.update((fields) => fields.filter((_, i) => i !== index));
    }
  }
}
