import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: "./app.home.html",
  standalone: false,
  styleUrl: './app.main.css',
})
export class home {
  data: any;
  showReports = false;
  current_project_id: string = ""
  projectName: string = ""
  newProjectForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.reload()
  }

  async deleteProject(project_id: string) {
    console.log(`Delete ${project_id}`)

    await (async () => {
      await this.http.post("http://localhost:4000/api/deleteProject", {
        id: project_id
      }, {observe: "response" }).subscribe( {
        next: res => {
          console.log(res);
          this.reload();
        },
        error: res => {
          this.reload()
        }
      });
    })();
  }

  async deleteReport(id: string) {
    console.log(`Delete ${id}`)

    await (async () => {
      await this.http.post("http://localhost:4000/api/deleteReport", {
        id: id
      }, {observe: "response" }).subscribe( {
        next: res => {
          console.log(res);
          this.showReportsOfProject(this.current_project_id)
        },
        error: res => {
          this.showReportsOfProject(this.current_project_id)
        }
      });
    })();
  }

  async showReportsOfProject(project_id: string) {
    await this.http.post('http://localhost:4000/api/getReports', {
      id: project_id
    }, {observe: "response" }).subscribe( {
      next: res => {
        this.data = res.body;
        this.showReports = true;
        this.current_project_id = project_id
        for (var entry of this.data) {
          this.projectName = entry.project_name
        }
        console.log(res.body);
      }
    });
  }

  showLastReport(report_id: string, project_id: string) {
    //! Implement
    console.log(`Show ${report_id} in the project ${project_id}`);
    return 0;
  }

  reload() {
    this.http.get('http://localhost:4000/api/getProjects', {observe: 'response'}).subscribe(res => {
      this.data = res.body;
      this.showReports = false;
    });
  }

  async handle_submit() {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    
      await this.http.post("http://localhost:4000/api/newProject", {
        name: this.newProjectForm.get("name")?.value
      }, { headers }).subscribe(res => {
        console.log(res)
      })
      this.reload(); 
  }
}
