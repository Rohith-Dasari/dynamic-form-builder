import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  config: any[] = [];
  form!: FormGroup;

  ngOnInit() {
    this.config = JSON.parse(localStorage.getItem('formConfig') || '[]');
    let formGroupObj: any = {};

    this.config.forEach(field => {
      formGroupObj[field.name] = new FormControl('');
    });

    this.form = new FormGroup(formGroupObj);
  }

  submit() {
    console.log(this.form.value);
    alert(JSON.stringify(this.form.value, null, 2));
  }

}
