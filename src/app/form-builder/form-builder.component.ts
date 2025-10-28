import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-builder',
  imports: [FormsModule, CommonModule],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss'
})
export class FormBuilderComponent {
  formFields: any[] = [];
  newField: any = { type: 'text', label: '', name: '', options: [] };

  onAddOption(option:string){
    this.newField.options.push(option)
  }

  addField() {
    this.formFields.push({...this.newField});
    this.newField = { type: 'text', label: '', name: '', options: [] };
  }

  saveForm() {
    localStorage.setItem('formConfig', JSON.stringify(this.formFields));
    alert('Form saved successfully!');
  }
}
