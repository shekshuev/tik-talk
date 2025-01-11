import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[dnd]',
})
export class DndDirective {
  constructor() {}

  @Output() fileDropped = new EventEmitter<File>();

  @HostBinding('class.fileover')
  fileover = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = false;
  }

  @HostListener('drop', ['$event'])
  onDragDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = false;

    this.fileDropped.emit(event.dataTransfer?.files[0]);
  }
}
