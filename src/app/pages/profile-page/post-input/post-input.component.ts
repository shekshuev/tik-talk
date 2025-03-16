import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostService } from '../../../data/services/post.service';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, NgIf, FormsModule, SvgIconComponent],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  isCommentInput = input(false);
  postId = input<number>(0);
  r2 = inject(Renderer2);
  postService = inject(PostService);
  profile = inject(ProfileService).me;

  @Output() created = new EventEmitter();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  postText = '';

  protected onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  protected onCreatePost() {
    if (this.postText !== '') {
      if (this.isCommentInput()) {
        firstValueFrom(
          this.postService.createComment({
            text: this.postText,
            authorId: this.profile()!.id,
            postId: this.postId(),
          })
        ).then(() => {
          this.postText = '';
          this.created.emit();
        });
      } else {
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
}
