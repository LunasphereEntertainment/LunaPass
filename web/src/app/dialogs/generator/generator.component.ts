import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
})
export class GeneratorComponent implements OnInit {
  private lowerOpts: number[] = [];
  private upperOpts: number[] = [];

  // Numbers 0 - 9
  private numericOpts = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

  // !, ", #, $, %, &, (, ), [, ], ^, _, ~
  private specialOpts = [33, 34, 35, 36, 37, 38, 40, 41, 91, 93, 94, 95, 126];

  generatorForm = new FormGroup({
    length: new FormControl(16),
    lowerCase: new FormControl(true),
    upperCase: new FormControl(true),
    numeric: new FormControl(true),
    special: new FormControl(true),
    password: new FormControl(''),
  });

  constructor(private dialogRef: MatDialogRef<GeneratorComponent>) {
    // Lowercase Chars - 97 => 112
    for (let i = 97; i <= 112; i++) {
      this.lowerOpts.push(i);
    }

    // Uppercase Chars - 65 => 90
    for (let i = 65; i <= 90; i++) {
      this.upperOpts.push(i);
    }
  }

  ngOnInit() {
    this.generate();
  }

  private ranInt(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  close(result?: string) {
    this.dialogRef.close(result);
  }

  generate() {
    const dictionary = [];

    if (this.generatorForm.get('lowerCase')?.value) {
      dictionary.push(...this.lowerOpts);
    }

    if (this.generatorForm.get('upperCase')?.value) {
      dictionary.push(...this.upperOpts);
    }

    if (this.generatorForm.get('numeric')?.value) {
      dictionary.push(...this.numericOpts);
    }

    if (this.generatorForm.get('special')?.value) {
      dictionary.push(...this.specialOpts);
    }

    let newPass = '';

    while (newPass.length < this.generatorForm.get('length')?.value) {
      newPass += String.fromCharCode(
        dictionary[this.ranInt(0, dictionary.length)],
      );
    }

    this.generatorForm.get('password')?.patchValue(newPass);
    return newPass;
  }
}
