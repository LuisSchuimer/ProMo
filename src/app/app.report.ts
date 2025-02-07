import { Component } from "@angular/core";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component ({
    selector: 'app-root',
    templateUrl: "./app.reports.html",
    standalone: false,
    styleUrl: './app.main.css'
})

export class reports {
    projects: any = [];
    currentDate = new Date();
    currentWeekNumber = this.getWeekNumber(this.currentDate);

    constructor(private http: HttpClient) { }

    reload() {
        console.log("Test")
        this.http.get('http://localhost:4000/api/getProjects', {observe: 'response'}).subscribe(res => {
            this.projects = res.body;
            console.log(this.projects)
        });
    }
    reportForm = new FormGroup({
        project_id: new FormControl('', Validators.required),
        budget: new FormControl('', Validators.required),
        budget_light: new FormControl('', Validators.required),
        time: new FormControl('', Validators.required),
        time_light: new FormControl('', Validators.required),
        quality: new FormControl('', Validators.required),
        quality_light: new FormControl('', Validators.required),
        customer: new FormControl('', Validators.required),
        customer_light: new FormControl('', Validators.required),
    });

    async handle_submit() {
        this.reportForm.disable()
        await this.http.post("http://localhost:4000/api/newReport", {
            project_id: this.reportForm.get("project_id")?.value,
            kw: this.currentWeekNumber,
            budget: this.reportForm.get("budget")?.value,
            budget_light: this.reportForm.get("budget_light")?.value,
            time: this.reportForm.get("time")?.value,
            time_light: this.reportForm.get("time_light")?.value,
            quality: this.reportForm.get("quality")?.value,
            quality_light: this.reportForm.get("quality_light")?.value,
            customer: this.reportForm.get("customer")?.value,
            customer_light: this.reportForm.get("customer_light")?.value,
        }, {observe: "response" }).subscribe( {
            next: res => {
                this.reload();
            },
            error: res => {
                this.reload()
            }
        });
    }
    

    ngOnInit() {
        this.reload()
    }

    getWeekNumber(date: Date): number {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
        return weekNumber;
    }
}
