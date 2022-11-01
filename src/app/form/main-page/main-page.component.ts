import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpErrorResponse } from '@angular/common/http';
import SignaturePad from 'signature_pad';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef; // Referencia al elemento <canvas> deonde se renderiza la firma
  sig!: SignaturePad;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService,
  ) {}
  form!: FormGroup;
  loading = false;
  ngOnInit(): void {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(80)]],
      birthDay: ['', []],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      sign: ['', [Validators.required]],
      phoneNumberPrefix: ['+52', [Validators.required]],
    });

    this.sig = new SignaturePad(this.canvas.nativeElement,{backgroundColor:'white'}); // asiganmos el elemento renderizado de la firma a una variable
    // agregamos un escuha para sincronizar cambios con el elemento y el form group
    this.sig.addEventListener('afterUpdateStroke', (event) => {
      this.signControl.setValue(this.sig.toDataURL("image/jpeg"));
    });
  }
  

  clearSign() {
    this.sig.clear(); // limpia la firm del dom
    this.form.controls['sign'].setValue(null); // set null al valor en el form group
  }

  get signControl(): AbstractControl {
    return this.form.controls['sign'];
  }

  submitForm(): void {
    if (this.form.valid) {
      console.log(this.form);
      
      this.loading = true;
      this.userService.create(this.form.value).subscribe({
        next: () => {
          this.form.reset({
            phoneNumberPrefix: '+52',
          });
          this.clearSign(); //limpiar firma
          this.message.success('El usuario ha sido creado');
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.message.error(error.error.message);
            this.loading = false;
          }
        },
      });
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
