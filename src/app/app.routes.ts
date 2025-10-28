import { Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';

export const routes: Routes = [
    {
        path:'builder', component:FormBuilderComponent
    },
    {
        path:'form', component:DynamicFormComponent
    },
    {
        path:'**',redirectTo:'builder'
    }
];
