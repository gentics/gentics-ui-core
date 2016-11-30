import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

/**
 * Accepts a string and returns it as trusted html that can be bound to [innerHTML].
 */
@Pipe({ name: 'trustedHTML', pure: true })
export class TrustedHTMLPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
