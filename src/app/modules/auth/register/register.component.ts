import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Map form fields to backend API expectations
      const registerData = {
        firstname: this.registerForm.value.nombres,
        lastname: this.registerForm.value.apellidos,
        dni: this.registerForm.value.dni,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'Tu cuenta ha sido creada correctamente.',
            icon: 'success',
            confirmButtonColor: '#c8102e',
            confirmButtonText: 'Ir al Dashboard'
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          console.error('Registration error:', err);
          Swal.fire({
            title: 'Error en el registro',
            text: err.error?.message || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
            icon: 'error',
            confirmButtonColor: '#c8102e',
            confirmButtonText: 'Cerrar'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Formulario Inválido',
        text: 'Por favor complete todos los campos correctamente.',
        icon: 'warning',
        confirmButtonColor: '#c8102e',
        confirmButtonText: 'Entendido'
      });
    }
  }
}
