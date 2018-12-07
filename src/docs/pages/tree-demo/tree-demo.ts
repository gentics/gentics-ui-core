import {Component, OnInit} from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { TreeDemoService } from './tree-demo.service';

@Component({
    templateUrl: './tree-demo.tpl.html',
    providers: [ TreeDemoService ]
})
export class TreeDemo implements OnInit {

    files: TreeNode[];

    selectedFile: TreeNode;

    constructor(private nodeService: TreeDemoService) {}

    ngOnInit(): void {
        this.nodeService.getFiles().then((files: TreeNode[]) => {
            return this.files = files;
        });
    }
}
