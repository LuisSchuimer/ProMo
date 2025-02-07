import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
    logging: false
});

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    lastReport: DataTypes.STRING
}, {
    createdAt: false,
    updatedAt: false
});

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    projectId: DataTypes.STRING,
    kw: DataTypes.NUMBER,
    budget: DataTypes.STRING,
    budget_light: DataTypes.NUMBER,
    time: DataTypes.STRING,
    time_light: DataTypes.NUMBER,
    quality: DataTypes.STRING,                                                                              
    quality_light: DataTypes.NUMBER,
    customer: DataTypes.STRING,
    customer_light: DataTypes.NUMBER,
    date: DataTypes.STRING

}, {
    createdAt: false,
    updatedAt: false
});

export async function addProject(name: string) {
    const id = uuidv4() as string;
    const project = Project.build({id: id, name: name});
    await project.save();
    return [true, id];
}
 
export async function deleteProject(id: string) {
    console.log(Project)
    Project.findByPk(id, {paranoid: false}).then(project => {
        //console.log(project)
        project?.destroy({ force: true })
    }).catch(err => 
        console.log(err)
    );
    await Report.destroy({
        where: {
            projectId: id
        },
        force: true,
    })
    return true
}

export async function addReport(
    name: string,
    projectId: string,
    kw: number,
    budget: string,
    budget_light: number,
    time: string,
    time_light: number,
    quality: string,
    quality_light: number,
    customer: string,
    customer_light: number
) {
    const id = uuidv4() as string
    var date = new Date();
    const newReport = Report.build({
        id: id,
        name: name,
        projectId: projectId,
        kw: kw,
        budget: budget,
        budget_light: budget_light,
        time: time,
        time_light: time_light,
        quality: quality,
        quality_light: quality_light,
        customer: customer,
        customer_light: customer_light,
        date: date.toISOString()
    })
    console.log(newReport)
    await newReport.save()
    await Project.update(
        { lastReport: id },
        {
            where: {
                id: projectId
            }
        }
    )
    return [true, id];
}

export async function getReportById(id: number) {
    return await Report.findOne({ where: { id: id }});
}

export async function getProjectNameById(id: string) {
    const project = await Project.findOne({where: {id: id}});
    if (project) {
        return project.dataValues.name;
    }else {
        return null;
    }
}

export async function deleteReport(id: string) {
    const data = await Report.findOne({
        where: {
            id: id
        }
    });
    const project_id = data?.dataValues.projectId
    await data?.destroy({ force: true})

    const allReportsOfProject = await Report.findAll({
        where: {
            projectId: project_id
        }
    });

    let highest_kw: number = 0
    let newest_report: any = null;
    for (var report of allReportsOfProject) {
        if (report.dataValues.kw > highest_kw) {
            highest_kw = report.dataValues.kw
            newest_report = report.dataValues.id
        }
    }
    await Project.update(
        { lastReport: newest_report },
        {
            where: {
                id: project_id
            }
        }
    )
    return true;
    
}

export async function isLastReport(report_id: string) {
    const data = await Project.findOne({
        where: {
            lastReport: report_id
        }
    })

    if (data) {
        return true;
    }else {
        return false
    }
    
}

export async function getReports(project_id: string) {
    let formatted_data: any = [];
    const data = await Report.findAll({
        where: {
            projectId: project_id
        }
    });
    for (var entry of data) {
        formatted_data.push({
            kw: entry.dataValues.kw,
            date: entry.dataValues.date,
            id: entry.dataValues.id,
            isLastReport: await isLastReport(entry.dataValues.id),
            project_name: await getProjectNameById(entry.dataValues.projectId),
            budget: entry.dataValues.budget,
            budget_light: entry.dataValues.budget_light,
            time: entry.dataValues.time,
            time_light: entry.dataValues.time_light,
            quality: entry.dataValues.quality,
            quality_light: entry.dataValues.quality_light,
            customer: entry.dataValues.customer,
            customer_light: entry.dataValues.customer_light
        })
    }
    return formatted_data;
}

export async function getProjects() {
    try {
        let formatted_data: Array<{id: string; name: string; lastReport: any; createdAt: Date; updatedAt: Date}> = [];
        const data = await Project.findAll();
        for (var entry of data) {
            let report: any = [{dataValues: {}}]
            if (entry.dataValues.lastReport != null) {
                report = await getReportById(entry.dataValues.lastReport);
            }
            formatted_data.push({
                id: entry.dataValues.id,
                name: entry.dataValues.name,
                lastReport: [report.dataValues],
                createdAt: entry.dataValues.createdAt,
                updatedAt: entry.dataValues.updatedAt
            })
        }
        return formatted_data
    } catch (error) {
        return [];
    }
}

export async function init() {
    await Report.sync()
    await Project.sync()   
}

init()