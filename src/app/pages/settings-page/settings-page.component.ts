import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ProfileService } from '../../data/services/profile.service';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader: any;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      // @ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        // @ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    if (this.form.invalid) {
      return;
    } else {
      firstValueFrom(
        // @ts-ignore
        this.profileService.patchProfile({
          ...this.form.value,
          stack: this.splitStack(this.form.value.stack),
        })
      );
    }
  }

  splitStack(stack: string | null | string[] | undefined) {
    if (Array.isArray(stack)) {
      return stack;
    } else if (!stack) {
      return [];
    } else {
      return stack.split(',').map((s) => s.trim());
    }
  }

  mergeStack(stack: string | null | string[]) {
    if (Array.isArray(stack)) {
      return stack.join(', ');
    } else if (!stack) {
      return '';
    } else {
      return stack;
    }
  }
}
