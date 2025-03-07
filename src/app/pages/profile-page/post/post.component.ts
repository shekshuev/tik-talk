import { Component, input } from '@angular/core';
import { Post } from '../../../data/interfaces/post.interface';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  post = input<Post>();
}
