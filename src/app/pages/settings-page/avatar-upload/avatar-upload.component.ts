import { Component, signal } from '@angular/core';
import { DndDirective } from '../../../common-ui/directives/dnd.directive';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DndDirective],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/svg/avatar-placeholder.svg');

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      this.preview.set((event.target as FileReader).result as string);
    };
    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
