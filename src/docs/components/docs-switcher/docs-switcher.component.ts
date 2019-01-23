import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'gtx-docs-switcher',
    templateUrl: './docs-switcher.tpl.html'
})
export class DocsSwitcher {
    docsBaseUrl = 'https://gentics.github.io/gentics-ui-core';
    ghVersionsResponse$: Observable<any>;

    constructor(private http: HttpClient) {
        this.ghVersionsResponse$ = this.fetchPreviousDocsFromGithub();
    }

    goToVersion(version: String | undefined = undefined): void {
        if (version) {
            window.location.href = `${this.docsBaseUrl}/_versions/${version}/`;
            return;
        }

        window.location.href = `${this.docsBaseUrl}/`;
        return;
    }

    fetchPreviousDocsFromGithub(): Observable<any> {
        return this
            .http.get(`https://api.github.com/repos/gentics/gentics-ui-core/contents/_versions?ref=gh-pages`)
            .pipe(
                map((res: Array<any>) => res.filter((item: any) => item.type === 'dir')),
                map(res => res.map((item: any) => item.name)),
                startWith([])
        );
    }
}
