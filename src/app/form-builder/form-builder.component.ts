import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { Constants } from '../constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-builder',
  imports: [FormsModule, CommonModule, DynamicFormComponent],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss',
})
export class FormBuilderComponent {
  constructor(private dialog: MatDialog,private snackBar: MatSnackBar) {}
  readonly constants = Constants;
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
      this.labelError = Constants.FBLabelRequiredError;
      hasError = true;
    }

    if (!this.newField.name?.trim()) {
      this.nameError = Constants.FBNameRequiredError;
      hasError = true;
    } else {
      const nameExists = this.formFields().some(
        (field) => field.name === this.newField.name.trim()
      );
      if (nameExists) {
        this.nameError = Constants.FBNameUniqueError;
        hasError = true;
      }
    }

    if (
      this.newField.type === 'dropdown' &&
      this.newField.options.length === 0
    ) {
      this.optionsError = Constants.FBOptionsRequiredError;
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
    this.snackBar.open('Form saved successfully!', 'OK', {
      duration: 3000, 
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['snackbar-success']
    });
  }

  deleteField(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.formFields().splice(index, 1);
      }
    });
  }
}
