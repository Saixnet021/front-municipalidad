import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Map dni to username/email if backend expects that, or update backend to accept dni
      // For now, we'll send it as is
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: 'Sesión iniciada correctamente'
          })
          this.router.navigate(['/']);
        },
        error: (err) => {
          Swal.fire({
            title: 'Error de inicio de sesión',
            text: 'Credenciales incorrectas. Por favor, verifique su DNI y contraseña.',
            icon: 'error',
            confirmButtonColor: '#c8102e',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
