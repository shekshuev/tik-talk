import { NgIf } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { PostService } from '../../../data/services/post.service';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, NgIf, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  postService = inject(PostService);
  profile = inject(ProfileService).me;

  postText = '';

  protected onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  protected onCreatePost() {
    if (this.postText !== '') {
      firstValueFrom(
        this.postService.createPost({
          title: 'qwerty',
          content: this.postText,
          authorId: this.profile()!.id,
        })
      ).then(() => (this.postText = ''));
    }
  }
}
