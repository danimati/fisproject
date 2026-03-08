import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GatewayService, User } from '../../../services/gateway.service';

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private gatewayService: GatewayService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      confirmPassword: ['', Validators.required],
      full_name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(255)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.registerForm.value;
    const registerData: RegisterUserRequest = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone || undefined,
      address: formData.address || undefined
    };

    this.gatewayService.createUser(registerData).subscribe({
      next: (response: User) => {
        this.loading = false;
        this.success = 'User registered successfully!';
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 2000);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Registration error:', err);
        this.error = err.error?.message || 'Failed to register user. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for form validation
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get full_name() { return this.registerForm.get('full_name'); }
  get phone() { return this.registerForm.get('phone'); }
  get address() { return this.registerForm.get('address'); }
}
